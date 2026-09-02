import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (!product) notFound();

  const variants = product.variantsJson ? JSON.parse(product.variantsJson) : [];
  const grindOptions = product.grindOptions ? JSON.parse(product.grindOptions) : [];

  return (
    <div>
      <h1 className="font-display text-2xl text-forest mb-6">Upravit produkt</h1>
      <ProductForm
        initialValues={{
          id: product.id,
          name: product.name,
          categorySlug: product.categorySlug,
          subcategory: product.subcategory ?? "",
          price: String(product.price),
          originalPrice: product.originalPrice ? String(product.originalPrice) : "",
          origin: product.origin,
          harvest: product.harvest,
          weight: product.weight,
          description: product.description,
          inStock: product.inStock,
          images: product.images.map((i) => i.url),
          variants: variants.map((v: any) => ({ label: v.label, price: String(v.price), inStock: v.stockCount > 0 })),
          grindOptions,
        }}
      />
    </div>
  );
}
