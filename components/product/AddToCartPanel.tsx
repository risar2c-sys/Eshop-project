"use client";

import { useState } from "react";
import { Minus, Plus, PackageCheck, PackageX } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasVariants = product.variants && product.variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState(hasVariants ? product.variants[0].label : undefined);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant = hasVariants ? product.variants.find((v) => v.label === selectedVariant) : undefined;
  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stockCount : product.stockCount;
  const currentInStock = activeVariant ? activeVariant.stockCount > 0 : product.inStock;

  const handleSelectVariant = (label: string) => {
    setSelectedVariant(label);
    const stock = product.variants.find((v) => v.label === label)?.stockCount ?? 1;
    setQuantity((q) => Math.min(q, Math.max(1, stock)));
  };

  const handleAdd = () => {
    addItem(product, quantity, selectedVariant);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {hasVariants && (
        <div>
          <p className="label-tag mb-2">Velikost balení</p>
          <div className="flex gap-2 flex-wrap">
            {product.variants.map((v) => (
              <button
                key={v.label}
                onClick={() => handleSelectVariant(v.label)}
                disabled={v.stockCount === 0}
                className={`px-4 py-2 rounded-organic border text-sm transition-colors
                  ${selectedVariant === v.label ? "border-forest bg-forest text-sand" : "border-forest/20 hover:border-forest/50"}
                  ${v.stockCount === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {v.label} — {v.price} Kč
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl text-bark">{currentPrice} Kč</span>
        {!hasVariants && product.originalPrice && product.originalPrice > product.price && (
          <span className="text-bark/40 line-through">{product.originalPrice} Kč</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        {currentInStock ? (
          <><PackageCheck size={18} className="text-olive" /><span className="text-olive">Skladem ({currentStock} ks)</span></>
        ) : (
          <><PackageX size={18} className="text-bark/50" /><span className="text-bark/50">Vyprodáno</span></>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-forest/20 rounded">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Snížit množství" className="p-2.5 hover:bg-forest/5">
            <Minus size={16} />
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
            disabled={quantity >= currentStock}
            aria-label="Zvýšit množství"
            className="p-2.5 hover:bg-forest/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <button onClick={handleAdd} disabled={!currentInStock} className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">
          {justAdded ? "Přidáno ✓" : "Přidat do košíku"}
        </button>
      </div>
      {currentInStock && quantity >= currentStock && (
        <p className="text-xs text-bark/50">Maximální dostupné množství skladem.</p>
      )}
    </div>
  );
}
