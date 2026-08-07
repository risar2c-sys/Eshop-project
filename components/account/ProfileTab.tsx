"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfileTab() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email] = useState(session?.user?.email ?? "");
  const [saved, setSaved] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
      <label className="block"><span className="text-sm text-bark/70 block mb-1">Jméno a příjmení</span><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></label>
      <label className="block"><span className="text-sm text-bark/70 block mb-1">E-mail</span><input value={email} disabled className="input opacity-60 cursor-not-allowed" /></label>
      <button type="submit" className="btn-primary">{saved ? "Uloženo ✓" : "Uložit změny"}</button>
    </form>
  );
}
