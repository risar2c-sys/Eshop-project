import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="section-heading mb-8">Kontakt</h1>
      <div className="space-y-5 text-bark/80">
        <p className="flex items-center gap-3"><MapPin size={20} className="text-gold shrink-0" /> Haškova 5, Praha 7</p>
        <p className="flex items-center gap-3"><Phone size={20} className="text-gold shrink-0" /> <span className="text-bark/40">telefon doplníme</span></p>
        <p className="flex items-center gap-3"><Mail size={20} className="text-gold shrink-0" /> <span className="text-bark/40">e-mail doplníme</span></p>
      </div>
    </div>
  );
}
