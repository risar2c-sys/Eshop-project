"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div>
      <div className="relative aspect-square bg-sand-dark rounded-organic overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => setIsZooming(false)} onMouseMove={handleMouseMove}>
        <Image src={images[active]} alt={alt} fill className="object-cover transition-transform duration-200"
          style={isZooming ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined} />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((src, i) => (
            <button key={src} onClick={() => setActive(i)} aria-label={`Zobrazit fotografii ${i + 1}`}
              className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-colors ${i === active ? "border-gold" : "border-transparent"}`}>
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
