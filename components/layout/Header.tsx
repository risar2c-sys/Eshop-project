"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const nav = [
  { href: "/caje", label: "Čaje" },
  { href: "/byliny", label: "Byliny" },
  { href: "/kava", label: "Káva" },
  { href: "/koreni", label: "Koření" },
  { href: "/kontakt", label: "Kontakt" },
];

type SearchResult = { id: string; name: string; price: number; image: string };

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { ids } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(query)}&limit=6`)
        .then((res) => res.json())
        .then(setResults)
        .catch(() => setResults([]));
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/hledani?q=${encodeURIComponent(query)}`);
    closeSearch();
  };

  return (
    <header className="sticky top-0 z-50 bg-sand/95 backdrop-blur border-b border-forest/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl text-forest shrink-0">
          Čaj Koření Káva
        </Link>

        {!searchOpen && (
          <nav className="hidden md:flex items-center gap-8 label-tag normal-case text-sm font-body text-bark">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-forest transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {searchOpen && (
          <div className="relative flex-1 max-w-md">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Hledat produkty…"
                className="flex-1 px-3 py-2 text-sm border border-forest/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </form>

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-forest/10 rounded-organic shadow-lg overflow-hidden z-50">
                {results.map((p) => (
                  <Link
                    key={p.id}
                    href={`/produkt/${p.id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-sand transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-sand-dark shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <span className="text-sm text-forest flex-1 truncate">{p.name}</span>
                    <span className="text-sm text-bark/60">{p.price} Kč</span>
                  </Link>
                ))}
                <button
                  onClick={handleSubmit}
                  className="w-full text-center text-sm text-forest py-2 border-t border-forest/10 hover:bg-sand"
                >
                  Zobrazit všechny výsledky
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-5 text-forest shrink-0">
          <button
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            aria-label={searchOpen ? "Zavřít hledání" : "Hledat"}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <Link href="/ucet" aria-label="Oblíbené" className="relative">
            <Heart size={20} className={ids.length > 0 ? "fill-gold text-gold" : ""} />
          </Link>
          <Link href={session ? "/ucet" : "/prihlaseni"} aria-label="Účet"><User size={20} /></Link>
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
