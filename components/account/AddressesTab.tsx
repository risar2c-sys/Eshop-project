"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
type Address = { id: string; label: string; street: string; city: string; zip: string };

export default function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([{ id: "a1", label: "Domů", street: "Vinohradská 12", city: "Praha 2", zip: "120 00" }]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", street: "", city: "", zip: "" });

  const addAddress = (e: React.FormEvent) => { e.preventDefault(); setAddresses((prev) => [...prev, { id: `a${prev.length + 1}`, ...form }]); setForm({ label: "", street: "", city: "", zip: "" }); setShowForm(false); };
  const removeAddress = (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-4">
      {addresses.map((a) => (
        <div key={a.id} className="flex items-center justify-between border border-forest/10 rounded-organic bg-white p-4">
          <div><p className="font-display text-forest">{a.label}</p><p className="text-sm text-bark/60">{a.street}, {a.city}, {a.zip}</p></div>
          <button onClick={() => removeAddress(a.id)} aria-label="Odstranit adresu"><Trash2 size={16} className="text-bark/40 hover:text-bark" /></button>
        </div>
      ))}
      {showForm ? (
        <form onSubmit={addAddress} className="border border-forest/10 rounded-organic bg-white p-4 space-y-3">
          <input placeholder="Název (např. Domů, Práce)" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="input" />
          <input placeholder="Ulice a č.p." required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Město" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
            <input placeholder="PSČ" required value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="input" />
          </div>
          <div className="flex gap-3"><button type="submit" className="btn-primary">Uložit adresu</button><button type="button" onClick={() => setShowForm(false)} className="btn-outline">Zrušit</button></div>
        </form>
      ) : (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm text-forest border border-dashed border-forest/30 rounded-organic px-4 py-3 w-full justify-center hover:bg-white"><Plus size={16} /> Přidat novou adresu</button>
      )}
    </div>
  );
}
