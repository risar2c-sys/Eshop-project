"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="section-heading mb-2">Zapomenuté heslo</h1>
      <p className="text-sm text-bark/60 mb-8">Zadejte e-mail, na který vám pošleme odkaz pro obnovení hesla.</p>
      {sent ? (
        <p className="text-olive text-sm">Pokud je e-mail <strong>{email}</strong> u nás registrovaný, dorazí na něj instrukce pro obnovení hesla.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block"><span className="text-sm text-bark/70 block mb-1">E-mail</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></label>
          <button type="submit" className="btn-primary w-full justify-center">Odeslat odkaz</button>
        </form>
      )}
    </div>
  );
}
