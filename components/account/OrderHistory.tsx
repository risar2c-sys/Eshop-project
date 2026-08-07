import { demoOrders, type OrderStatus } from "@/lib/orders";
const statusColor: Record<OrderStatus, string> = { "zpracovává se": "bg-gold/20 text-bark", expedováno: "bg-olive/20 text-olive", doručeno: "bg-forest/10 text-forest" };

export default function OrderHistory() {
  return (
    <div className="space-y-4">
      {demoOrders.map((order) => (
        <div key={order.id} className="border border-forest/10 rounded-organic bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div><p className="font-display text-forest">{order.id}</p><p className="text-xs text-bark/50">{new Date(order.date).toLocaleDateString("cs-CZ")}</p></div>
            <span className={`label-tag px-3 py-1.5 rounded-full ${statusColor[order.status]}`}>{order.status}</span>
          </div>
          <ul className="text-sm text-bark/70 mt-3 space-y-0.5">{order.items.map((item) => <li key={item.name}>{item.quantity}× {item.name}</li>)}</ul>
          <p className="text-right font-display text-forest mt-3">{order.total} Kč</p>
        </div>
      ))}
    </div>
  );
}
