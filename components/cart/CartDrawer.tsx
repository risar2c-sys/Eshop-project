"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/data";

export default function CartDrawer() {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem,
    applyCoupon, couponCode, discount, subtotal, shipping, vat, total,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const exclude = items.map((i) => i.product.id).join(",");
    fetch(`/api/products?limit=2${exclude ? `&exclude=${exclude}` : ""}`)
      .then((res) => res.json()).then(setSuggestions).catch(() => setSuggestions([]));
  }, [isOpen, items]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyCoupon(couponInput);
    setCouponMessage(discount > 0 || couponInput.trim() === "" ? null : "Kupón zkontrolujeme při dokončení objednávky.");
  };

  return (
    <>
      <div onClick={closeCart} className={`fixed inset-0 bg-forest/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      <aside role="dialog" aria-label="Nákupní košík"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-sand z-50 shadow-xl transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-forest/10">
          <h2 className="font-display text-xl text-forest">Košík {items.length > 0 && `(${items.length})`}</h2>
          <button onClick={closeCart} aria-label="Zavřít košík" className="text-forest"><X size={22} /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-lg text-forest">Košík je zatím prázdný</p>
            <p className="text-sm text-bark/60">Podívejte se po čajích, kávě, bylinách nebo koření.</p>
            <button onClick={closeCart} className="btn-outline mt-2">Pokračovat v nákupu</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map(({ product, quantity, variantLabel, unitPrice }) => (
                <div key={`${product.id}-${variantLabel ?? "default"}`} className="flex gap-3">
                  <div className="relative w-20 h-24 bg-sand-dark rounded shrink-0 overflow-hidden">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="label-tag truncate">{product.origin}</p>
                    <h3 className="font-display text-base text-forest truncate">{product.name}</h3>
                    {variantLabel && <p className="text-xs text-bark/50">Velikost: {variantLabel}</p>}
                    <p className="text-sm text-bark/70 mt-1">{unitPrice} Kč</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-forest/20 rounded">
                        <button onClick={() => updateQuantity(product.id, quantity - 1, variantLabel)} aria-label="Snížit množství" className="p-1.5 hover:bg-forest/5"><Minus size={14} /></button>
                        <span className="w-6 text-center text-sm">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1, variantLabel)} aria-label="Zvýšit množství" className="p-1.5 hover:bg-forest/5"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(product.id, variantLabel)} aria-label={`Odstranit ${product.name} z košíku`} className="text-bark/40 hover:text-bark"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}

              {suggestions.length > 0 && (
                <div className="pt-3 border-t border-forest/10">
                  <p className="label-tag mb-3">Mohlo by se vám líbit</p>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestions.map((p) => (
                      <div key={p.id} className="text-sm">
                        <div className="relative aspect-square bg-sand-dark rounded overflow-hidden">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                        <p className="mt-1 truncate">{p.name}</p>
                        <p className="text-bark/60">{p.price} Kč</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-forest/10 px-6 py-5 space-y-4">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Slevový kupón" className="flex-1 px-3 py-2 text-sm border border-forest/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-gold" />
                <button type="submit" className="btn-outline text-sm px-4 py-2">Použít</button>
              </form>
              {couponMessage && <p className="text-xs text-bark/60 -mt-2">{couponMessage}</p>}
              {couponCode && discount > 0 && <p className="text-xs text-olive -mt-2">Kupón {couponCode} uplatněn.</p>}

              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between"><dt className="text-bark/70">Mezisoučet</dt><dd>{subtotal} Kč</dd></div>
                {discount > 0 && <div className="flex justify-between text-olive"><dt>Sleva</dt><dd>−{discount} Kč</dd></div>}
                <div className="flex justify-between"><dt className="text-bark/70">Doprava</dt><dd>{shipping === 0 ? "zdarma" : `${shipping} Kč`}</dd></div>
                <div className="flex justify-between"><dt className="text-bark/70">DPH</dt><dd>{vat} Kč</dd></div>
                <div className="flex justify-between font-display text-lg text-forest pt-2 border-t border-forest/10"><dt>Celkem</dt><dd>{total} Kč</dd></div>
              </dl>

              <Link href="/pokladna" onClick={closeCart} className="btn-primary w-full justify-center">Pokračovat k pokladně</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
