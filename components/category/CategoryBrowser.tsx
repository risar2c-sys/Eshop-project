"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

const PAGE_SIZE = 8;
type SortOption = "doporucene" | "cena-asc" | "cena-desc" | "nazev";

export default function CategoryBrowser({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("doporucene");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (onlyInStock) list = list.filter((p) => p.inStock);
    switch (sort) {
      case "cena-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "cena-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "nazev": list = [...list].sort((a, b) => a.name.localeCompare(b.name, "cs")); break;
    }
    return list;
  }, [products, search, sort, onlyInStock]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const updateAndResetPage = <T,>(setter: (v: T) => void) => (value: T) => { setter(value); setPage(1); };

  return (
    <div className="grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-6">
        <div>
          <label htmlFor="search" className="label-tag block mb-2">Hledat</label>
          <input id="search" value={search} onChange={(e) => updateAndResetPage(setSearch)(e.target.value)} placeholder="Název produktu…" className="input" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyInStock} onChange={(e) => updateAndResetPage(setOnlyInStock)(e.target.checked)} className="accent-forest" />
          Pouze skladem
        </label>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-sm text-bark/60">Nalezeno {filtered.length} {filtered.length === 1 ? "produkt" : filtered.length < 5 ? "produkty" : "produktů"}</p>
          <select value={sort} onChange={(e) => updateAndResetPage(setSort)(e.target.value as SortOption)} className="text-sm border border-forest/20 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gold">
            <option value="doporucene">Doporučené</option>
            <option value="cena-asc">Cena: od nejnižší</option>
            <option value="cena-desc">Cena: od nejvyšší</option>
            <option value="nazev">Název A–Z</option>
          </select>
        </div>

        {paginated.length === 0 ? (
          <p className="text-bark/60 py-16 text-center">Žádné produkty neodpovídají zvoleným filtrům.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} aria-current={n === currentPage ? "page" : undefined}
                className={`w-9 h-9 rounded text-sm ${n === currentPage ? "bg-forest text-sand" : "border border-forest/20 hover:bg-forest/5"}`}>
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
