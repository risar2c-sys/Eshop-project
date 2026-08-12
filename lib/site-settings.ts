import { prisma } from "./prisma";

export type CategoryImages = Record<string, string>;

const DEFAULT_HERO = "/hero/hero-leaves.jpg";
const DEFAULT_CATEGORY_IMAGES: CategoryImages = {
  caje: "/categories/tea.jpg",
  byliny: "/categories/herbs.jpg",
  kava: "/categories/coffee.jpg",
  koreni: "/categories/spice.jpg",
};

export async function getSiteSettings() {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const categoryImages: CategoryImages = row?.categoryImagesJson
    ? { ...DEFAULT_CATEGORY_IMAGES, ...JSON.parse(row.categoryImagesJson) }
    : DEFAULT_CATEGORY_IMAGES;

  return {
    heroImageUrl: row?.heroImageUrl || DEFAULT_HERO,
    categoryImages,
  };
}

export async function saveSiteSettings(data: {
  heroImageUrl?: string;
  categoryImages?: CategoryImages;
}) {
  return prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      heroImageUrl: data.heroImageUrl,
      categoryImagesJson: JSON.stringify(data.categoryImages ?? {}),
    },
    update: {
      ...(data.heroImageUrl !== undefined ? { heroImageUrl: data.heroImageUrl } : {}),
      ...(data.categoryImages !== undefined
        ? { categoryImagesJson: JSON.stringify(data.categoryImages) }
        : {}),
    },
  });
}
