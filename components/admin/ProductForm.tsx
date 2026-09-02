"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import { getFlatSubcategoryOptions } from "@/lib/subcategories";

const categoryOptions = [
  { slug: "caje", label: "Čaje" },
  { slug: "byliny", label: "Byliny" },
  { slug: "kava", label: "Káva" },
  { slug: "koreni", label: "Koření" },
];

const IN_STOCK_COUNT = 9999;

type VariantInput = { label: string; price: string; inStock: boolean };

type ProductFormValues = {
  id?: string;
  name: string;
  categorySlug: string;
  subcategory: string;
  price: string;
  originalPrice: string;
  origin: string;
  harvest: string;
  weight: string;
  description: string;
  inStock: boolean;
  images: string[];
  variants: VariantInput[];
  grindOptions: string[];
};

const emptyValues: ProductFormValues = {
  name: "", categorySlug: "caje", subcategory: "", price: "", originalPrice: "", origin: "",
  harvest: "", weight: "", description: "", inStock: true,
  images: [], variants: [], grindOptions: [],
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ initialValues }: { initialValues?: ProductFormValues }) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? emptyValues);
  const [newGrindOption, setNewGrindOption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true); setError(null);
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const dataBase64 = await fileToBase64(file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type, filename: file.name, dataBase64 }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error ?? "Nahrání fotky se nezdařilo"); continue; }
        uploadedUrls.push(data.url);
      } catch { setError("Nahrání fotky se nezdařilo"); }
    }
    update("images", [...values.images, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (url: string) => update("images", values.images.filter((i) => i !== url));

  const addVariant = () => update("variants", [...values.variants, { label: "", price: "", inStock: true }]);
  const updateVariant = (index: number, patch: Partial<VariantInput>) => {
    update("variants", values.variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };
  const removeVariant = (index: number) => update("variants", values.variants.filter((_, i) => i !== index));

  const addGrindOption = () => {
    const val = newGrindOption.trim();
    if (!val || values.grindOptions.includes(val)) return;
    update("grindOptions", [...values.grindOptions, val]);
    setNewGrindOption("");
  };
  const removeGrindOption = (opt: string) => update("grindOptions", values.grindOptions.filter((o) => o !== opt));

  const subcategoryOptions = getFlatSubcategoryOptions(values.categorySlug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(null);

    const category = categoryOptions.find((c) => c.slug === values.categorySlug)?.label ?? "";
    const cleanVariants = values.variants
      .filter((v) => v.label.trim() !== "")
      .map((v) => ({ label: v.label, price: Number(v.price) || 0, stockCount: v.inStock ? IN_STOCK_COUNT : 0 }));

    const payload = {
      ...values,
      category,
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
      stockCount: values.inStock ? IN_STOCK_COUNT : 0,
      composition: [],
      aroma: [],
      variants: cleanVariants,
      grindOptions: values.grindOptions,
    };

    const url = isEditing ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = isEditing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) { setError("Uložení se nezdařilo, zkuste to prosím znovu."); return; }
    router.push("/admin/produkty");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <label className="block">
        <span className="text-sm text-bark/70 block mb-1">Název produktu</span>
        <input required value={values.name} onChange={(e) => update("name", e.target.value)} className="input" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-bark/70 block mb-1">Kategorie</span>
          <select
            value={values.categorySlug}
            onChange={(e) => update("categorySlug", e.target.value)}
            className="input"
          >
            {categoryOptions.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
        </label>
        {subcategoryOptions.length > 0 && (
          <label className="block">
            <span className="text-sm text-bark/70 block mb-1">Podkategorie</span>
            <select value={values.subcategory} onChange={(e) => update("subcategory", e.target.value)} className="input">
              <option value="">— nevybráno —</option>
              {subcategoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-bark/70 block mb-1">
            {values.variants.length > 0 ? "Základní hmotnost (info)" : "Hmotnost / gramáž"}
          </span>
          <input required placeholder="např. 100 g" value={values.weight} onChange={(e) => update("weight", e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="text-sm text-bark/70 block mb-1">
            {values.variants.length > 0 ? "Základní cena (nepoužije se, je-li nastavena velikost)" : "Cena (Kč)"}
          </span>
          <input required type="number" min={0} value={values.price} onChange={(e) => update("price", e.target.value)} className="input" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-bark/70 block mb-1">Původní cena (nepovinné, pro slevu)</span>
          <input type="number" min={0} value={values.originalPrice} onChange={(e) => update("originalPrice", e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="text-sm text-bark/70 block mb-1">Země / oblast původu</span>
          <input required value={values.origin} onChange={(e) => update("origin", e.target.value)} className="input" />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-bark/70 block mb-1">Sklizeň / pražení</span>
        <input required placeholder="např. sklizeň 2026" value={values.harvest} onChange={(e) => update("harvest", e.target.value)} className="input" />
      </label>

      <label className="block">
        <span className="text-sm text-bark/70 block mb-1">Popis</span>
        <textarea required rows={4} value={values.description} onChange={(e) => update("description", e.target.value)} className="input" />
      </label>

      {values.variants.length === 0 && (
        <label className="block">
          <span className="text-sm text-bark/70 block mb-1">Dostupnost</span>
          <select
            value={values.inStock ? "ano" : "ne"}
            onChange={(e) => update("inStock", e.target.value === "ano")}
            className="input"
          >
            <option value="ano">Skladem</option>
            <option value="ne">Není skladem</option>
          </select>
        </label>
      )}

      <div className="border border-forest/10 rounded-organic bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-display text-forest">Výběr velikosti balení</p>
            <p className="text-xs text-bark/50">
              Nepovinné. Pokud přidáte alespoň jednu velikost, zákazník si na stránce produktu vybere
              mezi nimi a pole "Dostupnost" výše se nepoužije.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {values.variants.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                placeholder="Velikost (např. 50 g)"
                value={v.label}
                onChange={(e) => updateVariant(i, { label: e.target.value })}
                className="input flex-1"
              />
              <input
                type="number"
                min={0}
                placeholder="Cena Kč"
                value={v.price}
                onChange={(e) => updateVariant(i, { price: e.target.value })}
                className="input w-28"
              />
              <select
                value={v.inStock ? "ano" : "ne"}
                onChange={(e) => updateVariant(i, { inStock: e.target.value === "ano" })}
                className="input w-40"
              >
                <option value="ano">Skladem</option>
                <option value="ne">Není skladem</option>
              </select>
              <button type="button" onClick={() => removeVariant(i)} aria-label="Odstranit velikost" className="text-bark/40 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addVariant} className="flex items-center gap-2 text-sm text-forest mt-3 hover:underline">
          <Plus size={14} /> Přidat velikost
        </button>
      </div>

      <div className="border border-forest/10 rounded-organic bg-white p-4">
        <div className="mb-3">
          <p className="font-display text-forest">Doplňkové možnosti (např. Mletá / Zrnková)</p>
          <p className="text-xs text-bark/50">
            Nepovinné. Zobrazí se jako samostatný výběr pod cenou na stránce produktu — nezávisle na
            velikosti balení, nemění cenu ani dostupnost.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {values.grindOptions.map((opt) => (
            <span key={opt} className="flex items-center gap-1.5 text-sm bg-sand px-3 py-1.5 rounded-full">
              {opt}
              <button type="button" onClick={() => removeGrindOption(opt)} aria-label={`Odstranit ${opt}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            placeholder="např. Mletá"
            value={newGrindOption}
            onChange={(e) => setNewGrindOption(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGrindOption(); } }}
            className="input flex-1"
          />
          <button type="button" onClick={addGrindOption} className="btn-outline text-sm px-4">
            Přidat
          </button>
        </div>
      </div>

      <div>
        <span className="text-sm text-bark/70 block mb-2">Fotografie produktu</span>
        <div className="flex flex-wrap gap-3 mb-3">
          {values.images.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded overflow-hidden border border-forest/10">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(url)} className="absolute top-0.5 right-0.5 bg-white/90 rounded-full p-0.5" aria-label="Odstranit fotku">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm border border-dashed border-forest/30 rounded-organic px-4 py-3 cursor-pointer hover:bg-white w-fit">
          <Upload size={16} />
          {uploading ? "Nahrávám…" : "Nahrát fotky (JPG, PNG, WEBP, max 8 MB)"}
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Ukládám…" : isEditing ? "Uložit změny" : "Vytvořit produkt"}
        </button>
      </div>
    </form>
  );
}
