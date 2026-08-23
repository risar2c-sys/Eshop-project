import { MapPin, Phone, Mail, Clock, Store } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const openingHours = [
  { day: "Pondělí – pátek", hours: "9:30 – 18:00" },
  { day: "Sobota", hours: "zavřeno" },
  { day: "Neděle", hours: "zavřeno" },
  { day: "Svátky", hours: "zavřeno" },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="section-heading mb-8">Kontakt</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <div className="space-y-5 text-bark/80 mb-10">
            <p className="flex items-center gap-3"><MapPin size={20} className="text-gold shrink-0" /> Haškova 5/132, 170 00, Praha 7</p>
            <p className="flex items-center gap-3"><Phone size={20} className="text-gold shrink-0" /> +420 602 879 152</p>
            <p className="flex items-center gap-3"><Mail size={20} className="text-gold shrink-0" /> igel-cz@volny.cz</p>
          </div>

          <div className="bg-white border border-forest/10 rounded-organic p-6">
            <div className="flex items-center gap-2 mb-4">
              <Store size={20} className="text-gold" />
              <h2 className="font-display text-xl text-forest">Kamenná prodejna (Čaje, Byliny)</h2>
            </div>

            <p className="flex items-center gap-3 text-bark/80 mb-4">
              <MapPin size={18} className="text-gold shrink-0" /> Haškova 5/132, 170 00, Praha 7
            </p>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gold shrink-0 mt-1" />
              <dl className="text-sm text-bark/80 space-y-1 w-full">
                {openingHours.map((row) => (
                  <div key={row.day} className="flex justify-between">
                    <dt>{row.day}</dt>
                    <dd className={row.hours === "zavřeno" ? "text-bark/40" : ""}>{row.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {settings.contactImageUrl && (
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full rounded-organic overflow-hidden">
            <img src={settings.contactImageUrl} alt="Prodejna Čaj Koření Káva" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
