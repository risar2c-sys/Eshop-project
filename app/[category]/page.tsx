import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import Breadcrumbs from "@/components/category/Breadcrumbs";
import CategoryBrowser from "@/components/category/CategoryBrowser";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) return {};
  return { title: `${category.name} — Čaj Koření Káva`, description: `${category.name} vybrané přímo od pěstitelů.` };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();
  const categoryProducts = await getProductsByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Breadcrumbs items={[{ label: "Domů", href: "/" }, { label: category.name }]} />
      <h1 className="section-heading mb-8">{category.name}</h1>
      <CategoryBrowser products={categoryProducts} />
    </div>
  );
}
