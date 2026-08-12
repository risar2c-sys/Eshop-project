import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { getSubcategories } from "@/lib/subcategories";
import Breadcrumbs from "@/components/category/Breadcrumbs";
import CategoryBrowser from "@/components/category/CategoryBrowser";
import SubcategoryPicker from "@/components/category/SubcategoryPicker";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};
  return { title: `${category.name} — Čaj Koření Káva`, description: `${category.name} vybrané přímo od pěstitelů.` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { sub?: string };
}) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const subcategories = getSubcategories(category.slug);
  const selectedSub = searchParams.sub;

  if (subcategories.length > 0 && !selectedSub) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumbs items={[{ label: "Domů", href: "/" }, { label: category.name }]} />
        <SubcategoryPicker
          categorySlug={category.slug}
          categoryName={category.name}
          subcategories={subcategories}
        />
      </div>
    );
  }

  const subcategoryFilter = selectedSub && selectedSub !== "vse" ? selectedSub : undefined;
  const categoryProducts = await getProductsByCategory(category.slug, subcategoryFilter);
  const subLabel = subcategories.find((s) => s.slug === selectedSub)?.label;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          subcategories.length > 0
            ? { label: category.name, href: `/${category.slug}` }
            : { label: category.name },
          ...(subLabel ? [{ label: subLabel }] : []),
        ]}
      />
      <h1 className="section-heading mb-8">
        {category.name}
        {subLabel ? ` — ${subLabel}` : ""}
      </h1>
      <CategoryBrowser products={categoryProducts} />
    </div>
  );
}
