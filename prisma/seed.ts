import { PrismaClient } from "@prisma/client";
import { seedProducts } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Mažu stávající data…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();

  console.log(`Vkládám ${seedProducts.length} produktů…`);
  for (const p of seedProducts) {
    await prisma.product.create({
      data: {
        slug: p.id,
        name: p.name,
        category: p.category,
        categorySlug: p.categorySlug,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        origin: p.origin,
        harvest: p.harvest,
        weight: p.weight,
        description: p.description,
        compositionJson: JSON.stringify(p.composition),
        aromaJson: JSON.stringify(p.aroma),
        preparationJson: p.preparation ? JSON.stringify(p.preparation) : null,
        nutritionJson: p.nutrition ? JSON.stringify(p.nutrition) : null,
        variantsJson: p.variants ? JSON.stringify(p.variants) : null,
        inStock: p.inStock,
        stockCount: p.stockCount,
        rating: p.rating,
        images: { create: p.gallery.map((url, i) => ({ url, position: i })) },
        reviews: {
          create: p.reviews.map((r) => ({
            author: r.author, rating: r.rating, text: r.text, createdAt: new Date(r.date),
          })),
        },
      },
    });
  }

  await prisma.coupon.createMany({
    data: [
      { code: "CKK10", discountRate: 0.1 },
      { code: "VITEJTE", discountRate: 0.05 },
    ],
  });

  console.log("Hotovo.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
