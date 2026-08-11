import Hero from "@/components/home/Hero";
import BrandIntro from "@/components/home/BrandIntro";
import CategoryGrid from "@/components/home/CategoryGrid";
import Benefits from "@/components/home/Benefits";
import BestSellers from "@/components/home/BestSellers";
import Newsletter from "@/components/home/Newsletter";
import FAQ from "@/components/home/FAQ";
import { getAllProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = (await getAllProducts()).slice(0, 4);
  return (
    <>
      <Hero />
      <BrandIntro />
      <CategoryGrid />
      <Benefits />
      <BestSellers products={products} />
      <Newsletter />
      <FAQ />
    </>
  );
}
