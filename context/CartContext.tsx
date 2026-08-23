"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/lib/data";

export type CartItem = {
  product: Product;
  quantity: number;
  variantLabel?: string;
  unitPrice: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number, variantLabel?: string) => void;
  removeItem: (productId: string, variantLabel?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantLabel?: string) => void;
  clearCart: () => void;
  couponCode: string;
  applyCoupon: (code: string) => void;
  discount: number;
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_COST = 79;
const VAT_RATE = 0.12;

const VALID_COUPONS: Record<string, number> = { CKK10: 0.1, VITEJTE: 0.05 };

function lineKey(productId: string, variantLabel?: string) {
  return variantLabel ? `${productId}::${variantLabel}` : productId;
}

function stockFor(product: Product, variantLabel?: string) {
  if (variantLabel) {
    return product.variants.find((v) => v.label === variantLabel)?.stockCount ?? 0;
  }
  return product.stockCount;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ckk-cart");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ckk-cart", JSON.stringify(items));
  }, [items]);

  const addItem: CartContextValue["addItem"] = (product, quantity = 1, variantLabel) => {
    const variant = variantLabel ? product.variants.find((v) => v.label === variantLabel) : undefined;
    const unitPrice = variant ? variant.price : product.price;
    const stock = stockFor(product, variantLabel);

    setItems((prev) => {
      const existing = prev.find(
        (i) => lineKey(i.product.id, i.variantLabel) === lineKey(product.id, variantLabel)
      );
      if (existing) {
        const nextQuantity = Math.min(stock, existing.quantity + quantity);
        return prev.map((i) =>
          lineKey(i.product.id, i.variantLabel) === lineKey(product.id, variantLabel)
            ? { ...i, quantity: nextQuantity }
            : i
        );
      }
      const cappedQuantity = Math.min(stock, quantity);
      if (cappedQuantity < 1) return prev;
      return [...prev, { product, quantity: cappedQuantity, variantLabel, unitPrice }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, variantLabel?: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i.product.id, i.variantLabel) !== lineKey(productId, variantLabel)));
  };

  const updateQuantity = (productId: string, quantity: number, variantLabel?: string) => {
    if (quantity < 1) return removeItem(productId, variantLabel);
    setItems((prev) =>
      prev.map((i) => {
        if (lineKey(i.product.id, i.variantLabel) !== lineKey(productId, variantLabel)) return i;
        const stock = stockFor(i.product, i.variantLabel);
        return { ...i, quantity: Math.min(stock, quantity) };
      })
    );
  };

  const clearCart = () => setItems([]);

  const applyCoupon = (code: string) => setCouponCode(code.trim().toUpperCase());

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  const discountRate = VALID_COUPONS[couponCode] ?? 0;
  const discount = Math.round(subtotal * discountRate);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const vat = Math.round((subtotal - discount) * VAT_RATE);
  const total = subtotal - discount + shipping + vat;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem, removeItem, updateQuantity, clearCart,
        couponCode, applyCoupon,
        discount, subtotal, shipping, vat, total, itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart musí být použit uvnitř <CartProvider>");
  return ctx;
}
