import { Truck, Leaf, ShieldCheck, RotateCcw } from "lucide-react";

const items = [
  { icon: Truck, title: "Doprava zdarma", text: "Při objednávce nad 999 Kč" },
  { icon: Leaf, title: "Sledovatelný původ", text: "Ke každému produktu farma i sklizeň" },
  { icon: ShieldCheck, title: "Bezpečný nákup", text: "Platba kartou, Apple Pay i na dobírku" },
  { icon: RotateCcw, title: "Vrácení do 30 dnů", text: "Bez udání důvodu" },
];

export default function Benefits() {
  return (
    <section className="bg-white/60 border-y border-forest/10">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-start gap-2">
            <Icon size={26} className="text-gold" />
            <p className="font-display text-lg text-forest">{title}</p>
            <p className="text-sm text-bark/60">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
