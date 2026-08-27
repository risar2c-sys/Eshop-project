import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const include = { images: { orderBy: { position: "asc" as const } }, reviews: { orderBy: { createdAt: "desc" as const } } };

function mapDbProduct(p: any) {
  return {
    id: p.slug, name: p.name, category: p.category, categorySlug: p.categorySlug,
    price: p.price, originalPrice: p.originalPrice ?? undefined, origin: p.origin, harvest: p.harvest,
    image: p.images[0]?.url ?? "/products/placeholder.jpg", gallery: p.images.map((img: any) => img.url),
    inStock: p.inStock, stockCount: p.stockCount, weight: p.weight, description: p.description,
    composition: JSON.parse(p.compositionJson),
    preparation: p.preparationJson ? JSON.parse(p.preparationJson) : undefined,
    nutrition: p.nutritionJson ? JSON.parse(p.nutritionJson) : undefined,
    rating: p.rating, aroma: JSON.parse(p.aromaJson),
    variants: p.variantsJson ? JSON.parse(p.variantsJson) : [],
    grindOptions: p.grindOptions ? JSON.parse(p.grindOptions) : [],
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");
  const excludeParam = searchParams.get("exclude");
  const limitParam = searchParams.get("limit");
  const where: any = {};
  if (idsParam) where.slug = { in: idsParam.split(",") };
  if (excludeParam) where.slug = { ...(where.slug ?? {}), notIn: excludeParam.split(",") };
  const rows = await prisma.product.findMany({ where, include, take: limitParam ? Number(limitParam) : undefined, orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows.map(mapDbProduct));
}
