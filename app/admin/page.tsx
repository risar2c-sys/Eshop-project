import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [productCount, outOfStockCount, orderCount] = await Promise.all([
    prisma.product.count(), prisma.product.count({ where: { inStock: false } }), prisma.order.count(),
  ]);
  const stats = [{ label: "Produktů celkem", value: productCount }, { label: "Vyprodáno", value: outOfStockCount }, { label: "Objednávek celkem", value: orderCount }];
  return (
    <div>
      <h1 className="font-display text-2xl text-forest mb-6">Přehled</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-forest/10 rounded-organic p-5">
            <p className="text-3xl font-display text-forest">{s.value}</p>
            <p className="text-sm text-bark/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <Link href="/admin/produkty/novy" className="btn-primary">Přidat nový produkt</Link>
    </div>
  );
}
