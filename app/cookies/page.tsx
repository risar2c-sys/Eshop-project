export default function CookiesPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="section-heading mb-6">Cookies</h1>

      <div className="space-y-6 text-bark/80 leading-relaxed">
        <p>
          Soubory cookie jsou malé textové soubory, které webová stránka ukládá ve vašem prohlížeči.
          Používáme je pouze v rozsahu nezbytném pro fungování e-shopu.
        </p>

        <div>
          <h2 className="font-display text-xl text-forest mb-2">Jaké cookies používáme</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Nezbytné cookies</strong> — udržují vás přihlášené a pamatují si obsah vašeho košíku mezi návštěvami. Bez nich by e-shop nefungoval.</li>
            <li><strong>Platební brána</strong> — při platbě kartou online mohou platební brány (např. GoPay, Comgate) použít vlastní cookies nezbytné k bezpečnému zpracování platby.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-forest mb-2">Co nepoužíváme</h2>
          <p>
            Nepoužíváme žádné marketingové ani reklamní cookies (např. Google Analytics, Facebook Pixel).
            Pokud se to v budoucnu změní, tuto stránku aktualizujeme.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-forest mb-2">Jak cookies spravovat</h2>
          <p>
            Ukládání cookies můžete kdykoliv omezit nebo zakázat v nastavení svého prohlížeče. Upozorňujeme,
            že bez nezbytných cookies nemusí e-shop fungovat správně (např. přihlášení nebo košík).
          </p>
        </div>
      </div>
    </div>
  );
}
