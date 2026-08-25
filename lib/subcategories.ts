export type SubcategoryNode = {
  slug: string;
  label: string;
  children?: SubcategoryNode[];
};

export const subcategoriesByCategory: Record<string, SubcategoryNode[]> = {
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
  kava: [
    { slug: "bez-prichute", label: "Bez příchutě" },
    { slug: "s-prichuti", label: "S příchutí" },
  ],
  koreni: [
    { slug: "jednodruhove", label: "Jednodruhové" },
    {
      slug: "smesi",
      label: "Směsi",
      children: [
        { slug: "bez-glutamatu", label: "Bez glutamátu" },
        { slug: "bez-soli", label: "Bez soli" },
        { slug: "ostatni", label: "Ostatní směsi" },
      ],
    },
  ],
};

export function getSubcategories(categorySlug: string): SubcategoryNode[] {
  return subcategoriesByCategory[categorySlug] ?? [];
}

export function getFlatSubcategoryOptions(categorySlug: string): { value: string; label: string }[] {
  const tree = getSubcategories(categorySlug);
  const options: { value: string; label: string }[] = [];
  for (const node of tree) {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        options.push({ value: `${node.slug}-${child.slug}`, label: `${node.label} – ${child.label}` });
      }
    } else {
      options.push({ value: node.slug, label: node.label });
    }
  }
  return options;
}
