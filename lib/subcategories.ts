export const subcategoriesByCategory: Record<string, { slug: string; label: string }[]> = {
  caje: [
    { slug: "cerne", label: "Černé" },
    { slug: "zelene", label: "Zelené" },
    { slug: "bile", label: "Bílé" },
    { slug: "oolong", label: "Oolong" },
    { slug: "puerh", label: "Pu-erh" },
    { slug: "duerh", label: "Duerh" },
    { slug: "ovocne", label: "Ovocné" },
    { slug: "rooibos", label: "Rooibos" },
    { slug: "bylinne", label: "Bylinné" },
  ],
};

export function getSubcategories(categorySlug: string) {
  return subcategoriesByCategory[categorySlug] ?? [];
}
