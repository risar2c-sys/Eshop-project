import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { images: { orderBy: { position: "asc" }, take: 1 } }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-forest">Produkty ({products.length})</h1>
        <Link href="/admin/produkty/novy" className="btn-primary">Přidat produkt</Link>
      </div>
      <div className="bg-white border border-forest/10 rounded-organic overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand text-left text-bark/60">
            <tr><th className="px-4 py-3">Foto</th><th className="px-4 py-3">Název</th><th className="px-4 py-3">Kategorie</th><th className="px-4 py-3">Cena</th><th className="px-4 py-3">Skladem</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-forest/10">
                <td className="px-4 py-3"><div className="w-10 h-10 bg-sand-dark rounded overflow-hidden">{p.images[0] && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}</div></td>
                <td className="px-4 py-3 text-forest">{p.name}</td>
                <td className="px-4 py-3 text-bark/60">{p.category}</td>
                <td className="px-4 py-3">{p.price} Kč</td>
                <td className="px-4 py-3">{p.inStock ? <span className="text-olive">{p.stockCount} ks</span> : <span className="text-bark/40">vyprodáno</span>}</td>
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  <Link href={`/admin/produkty/${p.id}`} className="text-forest underline">Upravit</Link>
                  <DeleteProductButton productId={p.id} productName={p.name} />
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-bark/50">Zatím žádné produkty.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
