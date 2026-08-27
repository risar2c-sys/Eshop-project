import { prisma } from "./prisma";

export type AromaNote = { label: string; intensity: number };
export type CategorySlug = "caje" | "byliny" | "kava" | "koreni";

export type Review = { id: string; author: string; rating: number; date: string; text: string };
export type Nutrition = { energyKcal: number; fat: number; carbs: number; protein: number };
export type Preparation = { tempC: number; amount: string; timeMin: number };

export type ProductVariant = {
  label: string;
  price: number;
  stockCount: number;
};

export type Product = {
  id: string;
  name: string;
  category: "čaj" | "bylina" | "káva" | "koření";
  categorySlug: CategorySlug;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  origin: string;
  harvest: string;
  image: string;
  gallery: string[];
  inStock: boolean;
  stockCount: number;
  weight: string;
  description: string;
  composition: string[];
  preparation?: Preparation;
  nutrition?: Nutrition;
  rating: number;
  aroma: AromaNote[];
  reviews: Review[];
  variants: ProductVariant[];
  grindOptions: string[];
};

export const categories: { slug: CategorySlug; name: string; image: string }[] = [
  { slug: "caje", name: "Čaje", image: "/categories/tea.jpg" },
  { slug: "byliny", name: "Byliny", image: "/categories/herbs.jpg" },
  { slug: "kava", name: "Káva", image: "/categories/coffee.jpg" },
  { slug: "koreni", name: "Koření", image: "/categories/spice.jpg" },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

function mapDbProduct(p: any): Product {
  return {
    id: p.slug,
    name: p.name,
    category: p.category,
    categorySlug: p.categorySlug,
    subcategory: p.subcategory ?? undefined,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    origin: p.origin,
    harvest: p.harvest,
    image: p.images[0]?.url ?? "/products/placeholder.jpg",
    gallery: p.images.map((img: any) => img.url),
    inStock: p.inStock,
    stockCount: p.stockCount,
    weight: p.weight,
    description: p.description,
    composition: JSON.parse(p.compositionJson),
    preparation: p.preparationJson ? JSON.parse(p.preparationJson) : undefined,
    nutrition: p.nutritionJson ? JSON.parse(p.nutritionJson) : undefined,
    rating: p.rating,
    aroma: JSON.parse(p.aromaJson),
    variants: p.variantsJson ? JSON.parse(p.variantsJson) : [],
    grindOptions: p.grindOptions ? JSON.parse(p.grindOptions) : [],
    reviews: p.reviews.map((r: any) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      date: r.createdAt.toISOString(),
      text: r.text,
    })),
  };
}

const include = {
  images: { orderBy: { position: "asc" as const } },
  reviews: { orderBy: { createdAt: "desc" as const } },
};

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ include, orderBy: { createdAt: "desc" } });
  return rows.map(mapDbProduct);
}

export async function getProductsByCategory(
  categorySlug: CategorySlug,
  filter?: { subcategory?: string; subcategoryPrefix?: string }
): Promise<Product[]> {
  const where: any = { categorySlug };
  if (filter?.subcategory) {
    where.subcategory = filter.subcategory;
  } else if (filter?.subcategoryPrefix) {
    where.subcategory = { startsWith: filter.subcategoryPrefix };
  }
  const rows = await prisma.product.findMany({
    where,
    include,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapDbProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug: id }, include });
  return row ? mapDbProduct(row) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categorySlug: product.categorySlug, NOT: { slug: product.id } },
    include,
    take: limit,
  });
  return rows.map(mapDbProduct);
}
