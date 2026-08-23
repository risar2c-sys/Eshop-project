"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import type { CategoryImages } from "@/lib/site-settings";

const categories = [
  { slug: "caje", label: "Čaje" },
  { slug: "byliny", label: "Byliny" },
  { slug: "kava", label: "Káva" },
  { slug: "koreni", label: "Koření" },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function SiteImagesForm({
  initialHero,
  initialCategoryImages,
  initialContactImage,
}: {
  initialHero: string;
  initialCategoryImages: CategoryImages;
  initialContactImage?: string;
}) {
  const [hero, setHero] = useState(initialHero);
  const [categoryImages, setCategoryImages] = useState<CategoryImages>(initialCategoryImages);
  const [contactImage, setContactImage] = useState(initialContactImage ?? "");
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const dataBase64 = await fileToBase64(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, filename: file.name, dataBase64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Nahrání fotky se nezdařilo");
        return null;
      }
      return data.url;
    } catch {
      setError("Nahrání fotky se nezdařilo");
      return null;
    }
  };

  const handleHeroUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading("hero");
    const url = await uploadFile(file);
    if (url) setHero(url);
    setUploading(null);
  };

  const handleCategoryUpload = async (slug: string, files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(slug);
    const url = await uploadFile(file);
    if (url) setCategoryImages((prev) => ({ ...prev, [slug]: url }));
    setUploading(null);
  };

  const handleContactUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading("contact");
    const url = await uploadFile(file);
    if (url) setContactImage(url);
    setUploading(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImageUrl: hero, categoryImages, contactImageUrl: contactImage }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Uložení se nezdařilo, zkuste to prosím znovu.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <p className="font-display text-lg text-forest mb-2">Hlavní banner (homepage)</p>
        <div className="relative w-full aspect-[16/6] bg-sand-dark rounded-organic overflow-hidden mb-3 border border-forest/10">
          <img src={hero} alt="" className="w-full h-full object-cover" />
        </div>
        <label className="flex items-center gap-2 text-sm border border-dashed border-forest/30 rounded-organic px-4 py-3 cursor-pointer hover:bg-white w-fit">
          <Upload size={16} />
          {uploading === "hero" ? "Nahrávám…" : "Nahradit banner (JPG, PNG, WEBP)"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleHeroUpload(e.target.files)}
          />
        </label>
      </div>

      <div>
        <p className="font-display text-lg text-forest mb-3">Dlaždice kategorií</p>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <p className="text-sm text-bark/70 mb-2">{cat.label}</p>
              <div className="relative w-full aspect-[3/4] bg-sand-dark rounded-organic overflow-hidden mb-2 border border-forest/10">
                <img src={categoryImages[cat.slug]} alt="" className="w-full h-full object-cover" />
              </div>
              <label className="flex items-center gap-2 text-xs border border-dashed border-forest/30 rounded-organic px-3 py-2 cursor-pointer hover:bg-white w-fit">
                <Upload size={14} />
                {uploading === cat.slug ? "Nahrávám…" : "Nahradit fotku"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleCategoryUpload(cat.slug, e.target.files)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-lg text-forest mb-2">Fotka ke kontaktu</p>
        <p className="text-xs text-bark/50 mb-3">Zobrazí se vedle kontaktních údajů a otevírací doby na stránce Kontakt.</p>
        <div className="relative w-full aspect-[4/3] bg-sand-dark rounded-organic overflow-hidden mb-3 border border-forest/10">
          {contactImage ? (
            <img src={contactImage} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-bark/30 text-sm">Zatím nenahráno</div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm border border-dashed border-forest/30 rounded-organic px-4 py-3 cursor-pointer hover:bg-white w-fit">
          <Upload size={16} />
          {uploading === "contact" ? "Nahrávám…" : "Nahrát fotku (JPG, PNG, WEBP)"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleContactUpload(e.target.files)}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? "Ukládám…" : saved ? "Uloženo ✓" : "Uložit změny"}
      </button>
    </div>
  );
}
