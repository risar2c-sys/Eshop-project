import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

const linkHrefs: Record<string, string> = {
  "Čaje": "/caje",
  "Byliny": "/byliny",
  "Káva": "/kava",
  "Koření": "/koreni",
  "Kontakt": "/kontakt",
  "Cookies": "/cookies",
  "Obchodní podmínky": "/obchodni-podminky",
  "GDPR": "/gdpr",
  "Reklamace": "/formulare/reklamace",
  "Vrácení zboží": "/formulare/odstoupeni",
};

const columns = [
  { title: "Obchod", links: ["Čaje", "Byliny", "Káva", "Koření"] },
  { title: "Zákaznický servis", links: ["Doprava a platba", "Reklamace", "Vrácení zboží", "FAQ", "Kontakt"] },
  { title: "Informace", links: ["O nás", "Blog", "Obchodní podmínky", "GDPR", "Cookies"] },
];

const openingHours = [
  { day: "Po – Pá", hours: "9:30 – 18:00" },
  { day: "Sobota", hours: "zavřeno" },
  { day: "Neděle", hours: "zavřeno" },
  { day: "Svátky", hours: "zavřeno" },
];

export default function Footer() {
  return (
    <footer className="print:hidden bg-forest text-sand mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-5">
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
                <li key={link}>
                  <Link href={linkHrefs[link] ?? "#"} className="hover:text-sand transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="label-tag text-gold">Otevírací doba</p>
          <p className="text-xs text-sand/50 mt-2 mb-2">Kamenná prodejna (Čaje, Byliny)</p>
          <dl className="text-sm text-sand/80 space-y-1">
            {openingHours.map((row) => (
              <div key={row.day} className="flex justify-between gap-4">
                <dt>{row.day}</dt>
                <dd className={row.hours === "zavřeno" ? "text-sand/40" : ""}>{row.hours}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-sand/10 py-6 text-center text-xs text-sand/50">
        © {new Date().getFullYear()} Martina Růžičková. Všechna práva vyhrazena. Obsah webu, texty a fotografie jsou chráněny autorským právem.
      </div>
    </footer>
  );
}
