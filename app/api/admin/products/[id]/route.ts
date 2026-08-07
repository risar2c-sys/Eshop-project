import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });
  const product = await prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { position: "asc" } } } });
  if (!product) return NextResponse.json({ error: "Nenalezeno" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });

  const body = await request.json();
  if (body.images) await prisma.productImage.deleteMany({ where: { productId: params.id } });

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: body.name,
      categorySlug: body.categorySlug,
      category: body.category,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      origin: body.origin,
      harvest: body.harvest,
      weight: body.weight,
      description: body.description,
      compositionJson: body.composition ? JSON.stringify(body.composition) : undefined,
      aromaJson: body.aroma ? JSON.stringify(body.aroma) : undefined,
      preparationJson: body.preparation ? JSON.stringify(body.preparation) : null,
      nutritionJson: body.nutrition ? JSON.stringify(body.nutrition) : null,
      variantsJson: body.variants && body.variants.length > 0 ? JSON.stringify(body.variants) : null,
      inStock: Boolean(body.inStock),
      stockCount: Number(body.stockCount) || 0,
      ...(body.images ? { images: { create: body.images.map((url: string, i: number) => ({ url, position: i })) } } : {}),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdminSession();
  if (!admin) return NextResponse.json({ error: "Nepovolený přístup" }, { status: 403 });
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
