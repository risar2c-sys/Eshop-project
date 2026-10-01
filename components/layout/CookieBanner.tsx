"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("ckk-cookie-notice");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("ckk-cookie-notice", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="print:hidden fixed bottom-0 left-0 right-0 z-[60] bg-forest text-sand px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-sand/90">
          <strong>Používáme cookies 🍪</strong><br />
          Aby náš e-shop fungoval správně, mohl vám zobrazovat oblíbené čaje či kávu a nákup byl
          co nejpohodlnější, potřebujeme váš souhlas s používáním souborů cookies. Kliknutím na
          tlačítko „Přijmout vše" nám k tomu dáváte zelenou. Nastavení můžete kdykoliv změnit nebo
          si přečíst podrobné{" "}
          <Link href="/cookies" className="underline">Zásady používání cookies</Link>.
        </p>
        <button onClick={dismiss} className="btn-outline border-sand/40 text-sand hover:bg-sand hover:text-forest text-sm px-5 py-2 whitespace-nowrap">
          Přijmout vše
        </button>
      </div>
    </div>
  );
}
