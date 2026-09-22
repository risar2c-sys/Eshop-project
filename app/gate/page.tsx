"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function GateForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Nesprávné heslo, zkuste to znovu.");
      return;
    }

    const from = searchParams.get("from") || "/";
    window.location.href = from;
  };

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <p className="font-display text-3xl text-forest mb-2">Čaj Koření Káva</p>
        <p className="text-sm text-bark/60 mb-8">Stránka se právě připravuje.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            autoFocus
            className="w-full px-4 py-3 text-center border border-forest/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-sand py-3 rounded-organic hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            {loading ? "Ověřuji…" : "Vstoupit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense fallback={null}>
      <GateForm />
    </Suspense>
  );
}
