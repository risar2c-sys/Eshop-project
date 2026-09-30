"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";

/**
 * Animace „Děkujeme za nákup!“ – ježek přiběhne a z ingrediencí se složí poděkování.
 * Zobrazí se přes celou obrazovku hned po odeslání objednávky, po doběhnutí sama zmizí.
 * Na výšku (mobil) se použije video 9:16, jinak čtverec.
 */

type Variant = "portrait" | "square";

// MP4 (H.264) umí všechny běžné prohlížeče, WebM je záloha pro ty, které H.264 nemají
const SOURCES: Record<Variant, { mp4: string; webm: string; poster: string }> = {
  portrait: { mp4: "/animace/dekujeme-na-vysku-v2.mp4", webm: "/animace/dekujeme-na-vysku-v2.webm", poster: "/animace/dekujeme-na-vysku-v2.jpg" },
  square: { mp4: "/animace/dekujeme-ctverec-v2.mp4", webm: "/animace/dekujeme-ctverec-v2.webm", poster: "/animace/dekujeme-ctverec-v2.jpg" },
};

const BACKGROUND = "#050805"; // barva okrajů videa, aby video splynulo s pozadím
const FADE_MS = 700;
const HOLD_AFTER_END_MS = 600;
const POSTER_MS = 3500; // když prohlížeč nedovolí přehrát video, ukážeme aspoň závěrečný obrázek
const SAFETY_MS = 14000; // pojistka, kdyby video z nějakého důvodu neskončilo

const squareMask =
  "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent), linear-gradient(to bottom, transparent, #000 7%, #000 93%, transparent)";

export default function ThankYouAnimation() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const [muted, setMuted] = useState(true);
  const [blocked, setBlocked] = useState(false);

  const close = useCallback(() => setClosing(true), []);

  // výběr varianty + respektování „omezit pohyb“ v systému
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    setVariant(window.matchMedia("(orientation: portrait)").matches ? "portrait" : "square");
  }, []);

  // spuštění videa (bez zvuku – prohlížeče jinak automatické přehrání zakážou)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setBlocked(true));
  }, [variant]);

  // když video nejde přehrát, ukážeme chvíli závěrečný snímek
  useEffect(() => {
    if (!blocked) return;
    const timer = window.setTimeout(close, POSTER_MS);
    return () => window.clearTimeout(timer);
  }, [blocked, close]);

  // plynulé zmizení
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => setVisible(false), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  // pojistka + zavření klávesou Esc + zamknutí scrollování stránky pod animací
  useEffect(() => {
    if (!visible) return;
    const safety = window.setTimeout(close, SAFETY_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(safety);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible, close]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused && !v.ended) v.play().catch(() => undefined);
  };

  if (!visible) return null;

  const src = variant ? SOURCES[variant] : null;
  const mediaClass = variant === "portrait" ? "h-full w-full object-cover" : "aspect-square w-[min(88vw,88vh)] object-contain";
  const mediaStyle = variant === "square" ? { WebkitMaskImage: squareMask, WebkitMaskComposite: "source-in", maskImage: squareMask, maskComposite: "intersect" } : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Děkujeme za nákup"
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity ease-out ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ backgroundColor: BACKGROUND, transitionDuration: `${FADE_MS}ms` }}
    >
      {src && !blocked && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onEnded={() => window.setTimeout(close, HOLD_AFTER_END_MS)}
          className={mediaClass}
          style={mediaStyle as React.CSSProperties | undefined}
        >
          <source src={src.mp4} type="video/mp4" />
          <source src={src.webm} type="video/webm" onError={() => setBlocked(true)} />
        </video>
      )}
      {src && blocked && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src.poster} alt="Děkujeme za nákup!" className={mediaClass} style={mediaStyle as React.CSSProperties | undefined} />
      )}

      <button
        type="button"
        onClick={close}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-sand/85 backdrop-blur transition hover:bg-black/50 hover:text-sand"
      >
        Přeskočit <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {!blocked && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-sand/85 backdrop-blur transition hover:bg-black/50 hover:text-sand"
        >
          {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
          {muted ? "Zapnout zvuk" : "Vypnout zvuk"}
        </button>
      )}
    </div>
  );
}
