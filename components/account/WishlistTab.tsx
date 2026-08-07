"use client";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

export default function WishlistTab() {
  const { ids } = useWishlist();
  const [saved, setSaved] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setSaved([]); setLoading(false); return; }
    fetch(`/api/products?ids=${ids.join(",")}`).then((res) => res.json()).then(setSaved).finally(() => setLoading(false));
  }, [ids]);

  if (loading) return <p className="text-sm text-bark/50">Načítám…</p>;
  if (saved.length === 0) return <p className="text-bark/60 text-sm">Zatím nemáte žádné oblíbené produkty.</p>;
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{saved.map((p) => <ProductCard key={p.id} product={p} />)}</div>;
}
