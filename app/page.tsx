import Hero from "@/components/home/Hero";
import BrandIntro from "@/components/home/BrandIntro";
import CategoryGrid from "@/components/home/CategoryGrid";
import Benefits from "@/components/home/Benefits";
import BestSellers from "@/components/home/BestSellers";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import { getAllProducts } from "@/lib/data";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, siteSettings] = await Promise.all([
    getAllProducts().then((p) => p.slice(0, 4)),
    getSiteSettings(),
  ]);
  return (
    <>
      <Hero imageUrl={siteSettings.heroImageUrl} />
      <BrandIntro />
      <CategoryGrid categoryImages={siteSettings.categoryImages} />
      <Benefits />
      <BestSellers products={products} />
      <Newsletter />
      <FAQ />
    </>
  );
}
