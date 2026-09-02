import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-forest mb-6">
        Objednávky ({orders.length})
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-forest/10 rounded-organic p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-forest">{order.orderNumber}</p>
                <p className="text-xs text-bark/50">
                  {new Date(order.createdAt).toLocaleDateString("cs-CZ")}{" "}
                  {new Date(order.createdAt).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/objednavky/${order.id}/stitek`} className="text-sm text-forest underline" target="_blank">
                  Vytisknout štítek
                </Link>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-bark/60 mb-1">Zákazník</p>
                <p className="text-forest">{order.firstName} {order.lastName}</p>
                <p className="text-bark/70">{order.email}</p>
                <p className="text-bark/70">{order.phone}</p>
              </div>
              <div>
                <p className="text-bark/60 mb-1">Doručení</p>
                <p className="text-bark/70">{order.street}, {order.city}, {order.zip}</p>
                <p className="text-bark/70">Doprava: {order.shippingMethod}</p>
                <p className="text-bark/70">Platba: {order.paymentMethod}</p>
              </div>
            </div>

            {order.note && (
              <p className="text-sm text-bark/60 mt-3">
                <span className="text-bark/50">Poznámka: </span>{order.note}
              </p>
            )}

            <ul className="text-sm text-bark/70 mt-4 space-y-0.5 border-t border-forest/10 pt-3">
              {order.items.map((item) => (
                <li key={item.id}>{item.quantity}× {item.name} — {item.price * item.quantity} Kč</li>
              ))}
            </ul>

            <p className="text-right font-display text-forest mt-3">{order.total} Kč</p>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-bark/50 text-center py-16">Zatím žádné objednávky.</p>
        )}
      </div>
    </div>
  );
}
