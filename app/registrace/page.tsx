"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Registrace se nezdařila."); setLoading(false); return; }
    const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Účet byl vytvořen, ale přihlášení selhalo."); return; }
    router.push("/ucet");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="section-heading mb-8">Vytvořit účet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block"><span className="text-sm text-bark/70 block mb-1">Jméno</span><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input" /></label>
          <label className="block"><span className="text-sm text-bark/70 block mb-1">Příjmení</span><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input" /></label>
        </div>
        <label className="block"><span className="text-sm text-bark/70 block mb-1">E-mail</span><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></label>
        <label className="block"><span className="text-sm text-bark/70 block mb-1">Heslo</span><input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" /><span className="text-xs text-bark/50 mt-1 block">Alespoň 8 znaků</span></label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? "Vytvářím účet…" : "Vytvořit účet"}</button>
      </form>
      <p className="text-sm text-bark/60 mt-6">Už máte účet? <Link href="/prihlaseni" className="underline text-forest">Přihlaste se</Link></p>
    </div>
  );
}
