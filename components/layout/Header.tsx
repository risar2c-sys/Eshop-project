"use client";

import Link from "next/link";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const nav = [
  { href: "/caje", label: "Čaje" },
  { href: "/byliny", label: "Byliny" },
  { href: "/kava", label: "Káva" },
  { href: "/koreni", label: "Koření" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { ids } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-sand/95 backdrop-blur border-b border-forest/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl text-forest">
          Čaj Koření Káva
        </Link>

        <nav className="hidden md:flex items-center gap-8 label-tag normal-case text-sm font-body text-bark">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-forest transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-forest">
          <button aria-label="Hledat"><Search size={20} /></button>
          <Link href="/ucet" aria-label="Oblíbené" className="relative">
            <Heart size={20} className={ids.length > 0 ? "fill-gold text-gold" : ""} />
          </Link>
          <Link href="/ucet" aria-label="Účet"><User size={20} /></Link>
          <button onClick={openCart} aria-label="Košík" className="relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-forest text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
