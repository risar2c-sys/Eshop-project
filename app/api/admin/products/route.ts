import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

const categoryLabel: Record<string, string> = { caje: "čaj", byliny: "bylina", kava: "káva", koreni: "koření" };

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });
  const products = await prisma.product.findMany({ include: { images: { orderBy: { position: "asc" } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });

  const body = await request.json();
  const slug = body.slug || slugify(body.name);
  const categorySlug = body.categorySlug;

  const product = await prisma.product.create({
    data: {
      slug,
      name: body.name,
      category: categoryLabel[categorySlug] ?? categorySlug,
      categorySlug,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      origin: body.origin,
      harvest: body.harvest,
      weight: body.weight,
      description: body.description,
      compositionJson: JSON.stringify(body.composition ?? []),
      aromaJson: JSON.stringify(body.aroma ?? []),
      preparationJson: body.preparation ? JSON.stringify(body.preparation) : null,
      nutritionJson: body.nutrition ? JSON.stringify(body.nutrition) : null,
      variantsJson: body.variants && body.variants.length > 0 ? JSON.stringify(body.variants) : null,
      inStock: Boolean(body.inStock),
      stockCount: Number(body.stockCount) || 0,
      rating: 0,
      images: { create: (body.images ?? []).map((url: string, i: number) => ({ url, position: i })) },
    },
  });

  return NextResponse.json(product);
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}
