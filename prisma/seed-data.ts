export type SeedVariant = { label: string; price: number; stockCount: number };
export type SeedProduct = {
  id: string; name: string; category: string; categorySlug: string;
  price: number; originalPrice?: number; origin: string; harvest: string;
  weight: string; description: string; composition: string[];
  preparation?: { tempC: number; amount: string; timeMin: number };
  nutrition?: { energyKcal: number; fat: number; carbs: number; protein: number };
  inStock: boolean; stockCount: number; rating: number;
  aroma: { label: string; intensity: number }[];
  gallery: string[];
  reviews: { author: string; rating: number; date: string; text: string }[];
  variants?: SeedVariant[];
};

const genericReviews = (name: string) => [
  { author: "Jana K.", rating: 5, date: "2026-06-02", text: `${name} kupuji opakovaně, chuť je pořád stejně dobrá.` },
  { author: "Petr S.", rating: 4, date: "2026-05-14", text: "Kvalita odpovídá ceně." },
];

export const seedProducts: SeedProduct[] = [
  {
    id: "assam-tgfop", name: "Assam TGFOP1", category: "čaj", categorySlug: "caje",
    price: 189, originalPrice: 219, origin: "Assam, Indie", harvest: "sklizeň 2026",
    weight: "100 g",
    description: "Sypaný černý čaj z vyšších poloh Assamu. Plná, sladová chuť s výraznou barvou nálevu.",
    composition: ["100 % sypaný černý čaj"],
    preparation: { tempC: 95, amount: "1 čajová lžička na 200 ml", timeMin: 4 },
    inStock: true, stockCount: 34, rating: 4.7,
    aroma: [{ label: "sladový", intensity: 0.9 }, { label: "medový", intensity: 0.5 }],
    gallery: ["/products/assam.jpg"],
    reviews: genericReviews("Assam TGFOP1"),
    variants: [
      { label: "50 g", price: 109, stockCount: 20 },
      { label: "100 g", price: 189, stockCount: 34 },
      { label: "250 g", price: 399, stockCount: 12 },
    ],
  },
  {
    id: "sencha-japonsko", name: "Sencha Fukamushi", category: "čaj", categorySlug: "caje",
    price: 249, origin: "Šizuoka, Japonsko", harvest: "sklizeň 2026", weight: "80 g",
    description: "Hluboce parovaný zelený čaj s trávovou chutí a umami dochutí.",
    composition: ["100 % sypaný zelený čaj"],
    preparation: { tempC: 70, amount: "2 g na 150 ml", timeMin: 2 },
    inStock: true, stockCount: 21, rating: 4.6,
    aroma: [{ label: "trávový", intensity: 0.85 }, { label: "mořský", intensity: 0.4 }],
    gallery: ["/products/sencha.jpg"], reviews: genericReviews("Sencha Fukamushi"),
  },
  {
    id: "etiopie-yirgacheffe", name: "Etiopie Yirgacheffe", category: "káva", categorySlug: "kava",
    price: 329, origin: "Yirgacheffe, Etiopie", harvest: "pražení 07/2026", weight: "250 g",
    description: "Světle pražená arabika s citrusovými a květinovými tóny.",
    composition: ["100 % arabika"],
    preparation: { tempC: 94, amount: "60 g na litr vody", timeMin: 4 },
    inStock: true, stockCount: 40, rating: 4.8,
    aroma: [{ label: "citrusový", intensity: 0.8 }, { label: "květinový", intensity: 0.7 }],
    gallery: ["/products/etiopie.jpg"], reviews: genericReviews("Etiopie Yirgacheffe"),
    variants: [
      { label: "250 g", price: 329, stockCount: 40 },
      { label: "1 kg", price: 1099, stockCount: 8 },
    ],
  },
  {
    id: "kurkuma-cerstva", name: "Kurkuma mletá", category: "koření", categorySlug: "koreni",
    price: 99, origin: "Kerala, Indie", harvest: "sklizeň 2025", weight: "100 g",
    description: "Jemně mletá kurkuma se sytě žlutou barvou a zemitou chutí.",
    composition: ["100 % mletá kurkuma"],
    nutrition: { energyKcal: 312, fat: 3.2, carbs: 65, protein: 8 },
    inStock: true, stockCount: 60, rating: 4.6,
    aroma: [{ label: "zemitý", intensity: 0.85 }, { label: "pepřový", intensity: 0.35 }],
    gallery: ["/products/kurkuma.jpg"], reviews: genericReviews("Kurkuma mletá"),
  },
  {
    id: "medunka-lekarska", name: "Meduňka lékařská", category: "bylina", categorySlug: "byliny",
    price: 79, origin: "Vysočina, ČR", harvest: "sklizeň 2026", weight: "40 g",
    description: "Sušená meduňka od českých pěstitelů, svěží citronová aróma.",
    composition: ["100 % sušená meduňka lékařská"],
    preparation: { tempC: 95, amount: "1 čajová lžička na 200 ml", timeMin: 8 },
    inStock: true, stockCount: 38, rating: 4.6,
    aroma: [{ label: "citronový", intensity: 0.9 }, { label: "svěží", intensity: 0.5 }],
    gallery: ["/products/medunka.jpg"], reviews: genericReviews("Meduňka lékařská"),
    variants: [
      { label: "40 g", price: 79, stockCount: 38 },
      { label: "100 g", price: 159, stockCount: 15 },
    ],
  },
];
