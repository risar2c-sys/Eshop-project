import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import type { CategoryImages } from "@/lib/site-settings";

export default function CategoryGrid({ categoryImages }: { categoryImages: CategoryImages }) {
  return (
    <section id="kategorie" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="section-heading mb-8">Kategorie</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/${cat.slug}`} className="group relative aspect-[3/4] rounded-organic overflow-hidden">
            <Image src={categoryImages[cat.slug] ?? cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-forest/30 group-hover:bg-forest/40 transition-colors" />
            <span className="absolute bottom-4 left-4 font-display italic text-xl text-sand">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
