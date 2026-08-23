import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const columns = [
  { title: "Obchod", links: ["Čaje", "Byliny", "Káva", "Koření"] },
  { title: "Zákaznický servis", links: ["Doprava a platba", "Reklamace", "Vrácení zboží", "FAQ", "Kontakt"] },
  { title: "Informace", links: ["O nás", "Blog", "Obchodní podmínky", "GDPR", "Cookies"] },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-sand mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl">Čaj Koření Káva</p>
          <div className="mt-3 text-sm text-sand/70 space-y-1.5">
            <p className="flex items-center gap-2"><MapPin size={15} className="text-gold shrink-0" /> Haškova 5/132, 170 00, Praha 7</p>
            <p className="flex items-center gap-2"><Phone size={15} className="text-gold shrink-0" /> +420 602 879 152</p>
            <p className="flex items-center gap-2"><Mail size={15} className="text-gold shrink-0" /> igel-cz@volny.cz</p>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="label-tag text-gold">{col.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-sand/80">
              {col.links.map((link) => (
                <li key={link}><Link href="#" className="hover:text-sand transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-sand/10 py-6 text-center text-xs text-sand/50">
        © {new Date().getFullYear()} Čaj Koření Káva. Všechna práva vyhrazena.
      </div>
    </footer>
  );
}
