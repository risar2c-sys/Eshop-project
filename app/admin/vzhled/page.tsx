import { getSiteSettings } from "@/lib/site-settings";
import SiteImagesForm from "@/components/admin/SiteImagesForm";

export default async function AdminAppearancePage() {
  const settings = await getSiteSettings();
  return (
    <div>
      <h1 className="font-display text-2xl text-forest mb-2">Vzhled webu</h1>
      <p className="text-sm text-bark/60 mb-6">
        Fotky banneru na homepage a dlaždic kategorií. Změny se projeví hned po uložení.
      </p>
      <SiteImagesForm
        initialHero={settings.heroImageUrl}
        initialCategoryImages={settings.categoryImages}
      />
    </div>
  );
}
