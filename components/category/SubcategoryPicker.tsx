import Link from "next/link";

export default function SubcategoryPicker({
  title,
  subtitle,
  items,
  allHref,
  allLabel = "Vše — nejsem si jistý/á",
}: {
  title: string;
  subtitle?: string;
  items: { label: string; href: string }[];
  allHref: string;
  allLabel?: string;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center py-6">
      <h1 className="section-heading mb-2">{title}</h1>
      {subtitle && <p className="text-bark/60 mb-8">{subtitle}</p>}

      <div className="flex flex-wrap justify-center gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-5 py-2.5 rounded-organic border border-forest/20 text-forest hover:bg-forest hover:text-sand hover:border-forest transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={allHref}
          className="px-5 py-2.5 rounded-organic border border-gold bg-gold/10 text-forest font-medium hover:bg-gold hover:text-white transition-colors"
        >
          {allLabel}
        </Link>
      </div>
    </div>
  );
}
