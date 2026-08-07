import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Drobečková navigace" className="text-sm text-bark/60 mb-6">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-forest transition-colors">{item.label}</Link>
            ) : (
              <span className="text-forest">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight size={14} className="mx-1" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
