"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!confirm(`Opravdu smazat produkt „${productName}“? Tuto akci nelze vrátit zpět.`)) return;
    setDeleting(true);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    router.refresh();
  };
  return <button onClick={handleDelete} disabled={deleting} className="text-red-700 underline disabled:opacity-40">{deleting ? "Mažu…" : "Smazat"}</button>;
}
