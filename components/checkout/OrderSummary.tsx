"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { shippingMethods } from "@/lib/checkout-schema";

export default function OrderSummary({ selectedShippingId }: { selectedShippingId?: string }) {
  const { items, subtotal, discount, vat } = useCart();
  const shipping = shippingMethods.find((m) => m.id === selectedShippingId);
  const shippingCost = shipping ? shipping.price : 0;
  const total = subtotal - discount + shippingCost + vat;

  return (
    <div className="bg-white rounded-organic border border-forest/10 p-6 h-fit sticky top-24">
      <p className="label-tag mb-4">Vaše objednávka</p>
      <ul className="space-y-3 mb-4">
        {items.map(({ product, quantity, variantLabel, note, unitPrice }) => (
          <li key={`${product.id}-${variantLabel ?? "default"}-${note ?? ""}`} className="flex gap-3 text-sm">
            <div className="relative w-12 h-14 bg-sand-dark rounded shrink-0 overflow-hidden">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-forest">{product.name}{variantLabel ? ` (${variantLabel})` : ""}{note ? ` – ${note}` : ""}</p>
              <p className="text-bark/50">{quantity}× {unitPrice} Kč</p>
            </div>
            <p className="text-bark">{unitPrice * quantity} Kč</p>
          </li>
        ))}
      </ul>
      <dl className="text-sm space-y-1.5 pt-4 border-t border-forest/10">
        <div className="flex justify-between"><dt className="text-bark/60">Mezisoučet</dt><dd>{subtotal} Kč</dd></div>
        {discount > 0 && <div className="flex justify-between text-olive"><dt>Sleva</dt><dd>−{discount} Kč</dd></div>}
        <div className="flex justify-between"><dt className="text-bark/60">Doprava</dt><dd>{shipping ? (shippingCost === 0 ? "zdarma" : `${shippingCost} Kč`) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-bark/60">DPH</dt><dd>{vat} Kč</dd></div>
        <div className="flex justify-between font-display text-lg text-forest pt-2 border-t border-forest/10"><dt>Celkem</dt><dd>{total} Kč</dd></div>
      </dl>
    </div>
  );
}
