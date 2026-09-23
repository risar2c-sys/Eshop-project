"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ckk-welcome-seen";
const DURATION = 2000;

export default function WelcomeSplash() {
  const pathname = usePathname();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode – animaci radši přeskočíme */
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setPlaying(true);
    const timer = window.setTimeout(() => setPlaying(false), DURATION);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!playing) return;
    const skip = () => setPlaying(false);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [playing]);

  if (!playing) return null;

  return (
    <div className="ckk-splash" aria-hidden="true" onClick={() => setPlaying(false)}>
      <div className="ckk-splash-run">
        <div className="ckk-splash-bob">
          <div className="ckk-jezek w-44 md:w-64">
            <img src="/jezek-telo.png" alt="" className="ckk-jezek-telo" />
            <img src="/jezek-noha-a.png" alt="" className="ckk-noha ckk-noha-a" />
            <img src="/jezek-noha-b.png" alt="" className="ckk-noha ckk-noha-b" />
            <img src="/jezek-noha-c.png" alt="" className="ckk-noha ckk-noha-c" />
            <img src="/jezek-noha-d.png" alt="" className="ckk-noha ckk-noha-d" />
          </div>
        </div>
      </div>
    </div>
  );
}
