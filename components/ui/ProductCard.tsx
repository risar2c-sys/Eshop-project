"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/data";
import AromaProfile from "./AromaProfile";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, isSaved } = useWishlist();
  const saved = isSaved(product.id);
  const onSale = product.originalPrice && product.originalPrice > product.price;

  const hasVariants = product.variants && product.variants.length > 0;
  const lowestPrice = hasVariants ? Math.min(...product.variants.map((v) => v.price)) : product.price;

  return (
    <article className="group bg-white rounded-organic overflow-hidden border border-forest/10 hover:border-gold/60 transition-colors duration-300 h-full flex flex-col">
      <div className="relative">
        <Link href={`/produkt/${product.id}`}>
          <div className="relative aspect-[4/5] bg-sand-dark overflow-hidden">
            <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            {onSale && (
              <span className="absolute top-3 left-3 label-tag bg-forest text-sand px-2 py-1 rounded-sm">sleva</span>
            )}
          </div>
        </Link>
        <button
          onClick={() => toggle(product.id)}
          aria-label={saved ? "Odebrat z oblíbených" : "Přidat do oblíbených"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
        >
          <Heart size={16} className={saved ? "fill-gold text-gold" : "text-forest"} />
        </button>
      </div>

      <div className="p-4 space-y-2 flex flex-col flex-1">
        <p className="label-tag">{product.origin} · {product.harvest}</p>
        <Link href={`/produkt/${product.id}`}>
          <h3 className="font-display text-lg text-forest hover:underline">{product.name}</h3>
        </Link>

        <AromaProfile notes={product.aroma} size={64} />

        <div className="flex items-baseline gap-2 pt-1">
          {hasVariants ? (
            <span className="font-display text-lg text-bark">od {lowestPrice} Kč</span>
          ) : (
            <>
              <span className="font-display text-lg text-bark">{product.price} Kč</span>
              {onSale && <span className="text-sm text-bark/40 line-through">{product.originalPrice} Kč</span>}
            </>
          )}
        </div>

        <div className="mt-auto pt-1">
          {!hasVariants && (
            <button
              onClick={() => addItem(product)}
              className="w-full text-sm border border-forest/20 rounded py-2 hover:bg-forest hover:text-sand hover:border-forest transition-colors"
            >
              Přidat do košíku
            </button>
          )}
          {hasVariants && (
            <Link
              href={`/produkt/${product.id}`}
              className="block text-center w-full text-sm border border-forest/20 rounded py-2 hover:bg-forest hover:text-sand hover:border-forest transition-colors"
            >
              Vybrat velikost
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
