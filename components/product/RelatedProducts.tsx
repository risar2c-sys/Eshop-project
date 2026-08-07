import type { Product } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

export default function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="section-heading mb-6">Související produkty</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
