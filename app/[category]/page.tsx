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
  searchParams: { sub?: string; sub2?: string };
}) {
  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const tree = getSubcategories(category.slug);
  const selectedSub = searchParams.sub;
  const selectedSub2 = searchParams.sub2;

  if (tree.length > 0 && !selectedSub) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumbs items={[{ label: "Domů", href: "/" }, { label: category.name }]} />
        <SubcategoryPicker
          title={category.name}
          subtitle="Jaký druh vás zajímá?"
          items={tree.map((node) => ({ label: node.label, href: `/${category.slug}?sub=${node.slug}` }))}
          allHref={`/${category.slug}?sub=vse`}
        />
      </div>
    );
  }

  const topNode = tree.find((n) => n.slug === selectedSub);

  if (topNode?.children && topNode.children.length > 0 && !selectedSub2) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Breadcrumbs
          items={[
            { label: "Domů", href: "/" },
            { label: category.name, href: `/${category.slug}` },
            { label: topNode.label },
          ]}
        />
        <SubcategoryPicker
          title={topNode.label}
          subtitle="Upřesněte výběr"
          items={topNode.children.map((child) => ({
            label: child.label,
            href: `/${category.slug}?sub=${topNode.slug}&sub2=${child.slug}`,
          }))}
          allHref={`/${category.slug}?sub=${topNode.slug}&sub2=vse`}
          allLabel="Všechny směsi"
        />
      </div>
    );
  }

  let subcategoryFilter: string | undefined;
  let subcategoryPrefix: string | undefined;
  const breadcrumbExtra: string[] = [];

  if (selectedSub && selectedSub !== "vse") {
    if (topNode?.children && topNode.children.length > 0) {
      breadcrumbExtra.push(topNode.label);
      if (selectedSub2 && selectedSub2 !== "vse") {
        const childNode = topNode.children.find((c) => c.slug === selectedSub2);
        if (childNode) {
          subcategoryFilter = `${topNode.slug}-${childNode.slug}`;
          breadcrumbExtra.push(childNode.label);
        }
      } else {
        subcategoryPrefix = `${topNode.slug}-`;
      }
    } else if (topNode) {
      subcategoryFilter = topNode.slug;
      breadcrumbExtra.push(topNode.label);
    }
  }

  const categoryProducts = await getProductsByCategory(category.slug, {
    subcategory: subcategoryFilter,
    subcategoryPrefix,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          tree.length > 0 ? { label: category.name, href: `/${category.slug}` } : { label: category.name },
          ...breadcrumbExtra.map((label) => ({ label })),
        ]}
      />
      <h1 className="section-heading mb-8">
        {category.name}
        {breadcrumbExtra.length > 0 ? ` — ${breadcrumbExtra.join(" · ")}` : ""}
      </h1>
      <CategoryBrowser products={categoryProducts} />
    </div>
  );
}
