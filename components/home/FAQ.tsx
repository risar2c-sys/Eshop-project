const faqs = [
  { day: "" },
];

const faqItems = [
  { q: "Jak dlouho trvá doručení?", a: "Objednávky expedujeme do 24 hodin, doručení obvykle trvá 1–2 pracovní dny." },
  { q: "Odkud pochází vaše produkty?", a: "U každého produktu uvádíme konkrétní farmu nebo oblast původu a datum sklizně." },
];

export default function FAQ() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="section-heading mb-8">Časté dotazy</h2>
      <div className="divide-y divide-forest/10 border-t border-b border-forest/10">
        {faqItems.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="cursor-pointer list-none flex items-center justify-between font-display text-lg text-forest">
              {item.q}
              <span className="text-gold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-bark/70 mt-3 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
