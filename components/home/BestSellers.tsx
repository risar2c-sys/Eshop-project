import type { Product } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="label-tag text-olive">nejžádanější</p>
          <h2 className="section-heading">Nejprodávanější</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
