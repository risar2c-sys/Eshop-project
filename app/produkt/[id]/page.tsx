import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductById, getRelatedProducts } from "@/lib/data";
import Breadcrumbs from "@/components/category/Breadcrumbs";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import AromaProfile from "@/components/ui/AromaProfile";
import StarRating from "@/components/product/StarRating";
import ReviewsList from "@/components/product/ReviewsList";
import RelatedProducts from "@/components/product/RelatedProducts";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return {};
  return {
    title: `${product.name} — Čaj Koření Káva`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] },
  };
}

const categoryLabel: Record<string, string> = { caje: "Čaje", byliny: "Byliny", kava: "Káva", koreni: "Koření" };

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Breadcrumbs items={[
        { label: "Domů", href: "/" },
        { label: categoryLabel[product.categorySlug], href: `/${product.categorySlug}` },
        { label: product.name },
      ]} />

      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.gallery} alt={product.name} />

        <div>
          <p className="label-tag">{product.origin} · {product.harvest}</p>
          <h1 className="font-display text-3xl md:text-4xl text-forest mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-bark/60">{product.rating.toFixed(1)}</span>
          </div>

          <p className="text-bark/70 leading-relaxed mt-4">{product.description}</p>

          {product.aroma.length > 0 && (
            <div className="mt-5">
              <p className="label-tag mb-2">Chuťový profil</p>
              <AromaProfile notes={product.aroma} size={80} />
            </div>
          )}

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          <dl className="mt-8 text-sm divide-y divide-forest/10 border-t border-forest/10">
            <div className="flex justify-between py-2.5">
              <dt className="text-bark/60">Složení</dt>
              <dd className="text-right max-w-[60%]">{product.composition.join(", ")}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-bark/60">Země původu</dt>
              <dd>{product.origin}</dd>
            </div>
            {product.variants.length === 0 && (
              <div className="flex justify-between py-2.5">
                <dt className="text-bark/60">Hmotnost</dt>
                <dd>{product.weight}</dd>
              </div>
            )}
            {product.preparation && (
              <div className="flex justify-between py-2.5">
                <dt className="text-bark/60">Příprava</dt>
                <dd className="text-right">{product.preparation.amount} · {product.preparation.tempC} °C · {product.preparation.timeMin} min</dd>
              </div>
            )}
          </dl>

          {product.nutrition && (
            <div className="mt-6">
              <p className="label-tag mb-2">Výživové údaje (na 100 g)</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm bg-white rounded-organic p-3 border border-forest/10">
                <div><p className="font-display text-forest">{product.nutrition.energyKcal}</p><p className="text-xs text-bark/50">kcal</p></div>
                <div><p className="font-display text-forest">{product.nutrition.fat} g</p><p className="text-xs text-bark/50">tuky</p></div>
                <div><p className="font-display text-forest">{product.nutrition.carbs} g</p><p className="text-xs text-bark/50">sacharidy</p></div>
                <div><p className="font-display text-forest">{product.nutrition.protein} g</p><p className="text-xs text-bark/50">bílkoviny</p></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewsList reviews={product.reviews} rating={product.rating} />
      <RelatedProducts products={related} />
    </div>
  );
}
