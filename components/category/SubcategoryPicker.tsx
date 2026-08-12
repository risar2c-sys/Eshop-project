import Link from "next/link";

export default function SubcategoryPicker({
  categorySlug,
  categoryName,
  subcategories,
}: {
  categorySlug: string;
  categoryName: string;
  subcategories: { slug: string; label: string }[];
}) {
  return (
    <div className="max-w-3xl mx-auto text-center py-6">
      <h1 className="section-heading mb-2">{categoryName}</h1>
      <p className="text-bark/60 mb-8">Jaký druh vás zajímá?</p>

      <div className="flex flex-wrap justify-center gap-3">
        {subcategories.map((s) => (
          <Link
            key={s.slug}
            href={`/${categorySlug}?sub=${s.slug}`}
            className="px-5 py-2.5 rounded-organic border border-forest/20 text-forest hover:bg-forest hover:text-sand hover:border-forest transition-colors"
          >
            {s.label}
          </Link>
        ))}
        <Link
          href={`/${categorySlug}?sub=vse`}
          className="px-5 py-2.5 rounded-organic border border-gold bg-gold/10 text-forest font-medium hover:bg-gold hover:text-white transition-colors"
        >
          Vše — nejsem si jistý/á
        </Link>
      </div>
    </div>
  );
}
