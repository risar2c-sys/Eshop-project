import { prisma } from "@/lib/prisma";
import Breadcrumbs from "@/components/category/Breadcrumbs";
import ProductCard from "@/components/ui/ProductCard";

export const dynamic = "force-dynamic";

const include = {
  images: { orderBy: { position: "asc" as const } },
  reviews: { orderBy: { createdAt: "desc" as const } },
};

function mapDbProduct(p: any) {
  return {
    id: p.slug, name: p.name, category: p.category, categorySlug: p.categorySlug,
    price: p.price, originalPrice: p.originalPrice ?? undefined, origin: p.origin, harvest: p.harvest,
    image: p.images[0]?.url ?? "/products/placeholder.jpg", gallery: p.images.map((img: any) => img.url),
    inStock: p.inStock, stockCount: p.stockCount, weight: p.weight, description: p.description,
    composition: JSON.parse(p.compositionJson),
    preparation: p.preparationJson ? JSON.parse(p.preparationJson) : undefined,
    nutrition: p.nutritionJson ? JSON.parse(p.nutritionJson) : undefined,
    rating: p.rating, aroma: JSON.parse(p.aromaJson),
    variants: p.variantsJson ? JSON.parse(p.variantsJson) : [],
    grindOptions: p.grindOptions ? JSON.parse(p.grindOptions) : [],
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = (searchParams.q ?? "").trim();

  const rows = query
    ? await prisma.product.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        include,
        orderBy: { createdAt: "desc" },
      })
    : [];

  const products = rows.map(mapDbProduct);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Breadcrumbs items={[{ label: "Domů", href: "/" }, { label: "Vyhledávání" }]} />
      <h1 className="section-heading mb-2">Vyhledávání</h1>
      <p className="text-bark/60 mb-8">
        {query ? `Výsledky pro „${query}“ (${products.length})` : "Zadejte, co hledáte."}
      </p>

      {query && products.length === 0 && (
        <p className="text-bark/60 py-16 text-center">Nic jsme nenašli. Zkuste jiné slovo.</p>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
