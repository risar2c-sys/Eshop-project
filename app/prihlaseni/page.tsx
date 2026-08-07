"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Nesprávný e-mail nebo heslo."); return; }
    router.push("/ucet");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="section-heading mb-2">Přihlášení</h1>
      <p className="text-sm text-bark/60 mb-8">Zkuste demo účet: <strong>richard@cajkorenikava.cz</strong> / heslo <strong>heslo123</strong></p>
      <button onClick={() => signIn("google", { callbackUrl: "/ucet" })} className="btn-outline w-full justify-center mb-6">Přihlásit se přes Google</button>
      <div className="flex items-center gap-3 text-xs text-bark/40 mb-6"><span className="flex-1 h-px bg-forest/10" />nebo e-mailem<span className="flex-1 h-px bg-forest/10" /></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block"><span className="text-sm text-bark/70 block mb-1">E-mail</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></label>
        <label className="block"><span className="text-sm text-bark/70 block mb-1">Heslo</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" /></label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? "Přihlašuji…" : "Přihlásit se"}</button>
      </form>
      <div className="flex justify-between text-sm mt-6 text-bark/60">
        <Link href="/zapomenute-heslo" className="underline">Zapomenuté heslo</Link>
        <Link href="/registrace" className="underline">Vytvořit účet</Link>
      </div>
    </div>
  );
}
