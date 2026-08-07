"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type WishlistContextValue = {
  ids: string[];
  toggle: (productId: string) => void;
  isSaved: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ckk-wishlist");
    if (saved) {
      try { setIds(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ckk-wishlist", JSON.stringify(ids));
  }, [ids]);

  const toggle = (productId: string) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const isSaved = (productId: string) => ids.includes(productId);

  return <WishlistContext.Provider value={{ ids, toggle, isSaved }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist musí být použit uvnitř <WishlistProvider>");
  return ctx;
}
