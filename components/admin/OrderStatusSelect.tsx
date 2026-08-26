"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["zpracovává se", "expedováno", "doručeno"];

export default function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleChange = async (status: string) => {
    setSaving(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="text-sm border border-forest/20 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gold"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
