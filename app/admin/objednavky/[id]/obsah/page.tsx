import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintButton from "@/components/admin/PrintButton";

function SlipContent({ order }: { order: any }) {
  return (
    <div className="bg-white p-10">
      <p className="font-display text-2xl text-forest mb-1">Čaj Koření Káva</p>
      <p className="text-sm text-bark/50 mb-6">Dodací list</p>

      <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
        <div>
          <p className="text-bark/50 text-xs uppercase tracking-widest mb-1">Objednávka</p>
          <p className="text-forest font-display">{order.orderNumber}</p>
          <p className="text-bark/60 mt-1">
            {new Date(order.createdAt).toLocaleDateString("cs-CZ")}
          </p>
        </div>
        <div>
          <p className="text-bark/50 text-xs uppercase tracking-widest mb-1">Zákazník</p>
          <p className="text-forest">{order.firstName} {order.lastName}</p>
          <p className="text-bark/60">{order.email}</p>
          <p className="text-bark/60">{order.phone}</p>
        </div>
      </div>

      <table className="w-full text-sm border-t border-forest/20">
        <thead>
          <tr className="text-left text-bark/50 text-xs uppercase tracking-widest">
            <th className="py-2">Položka</th>
            <th className="py-2 text-center">Množství</th>
            <th className="py-2 text-right">Cena</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any) => (
            <tr key={item.id} className="border-t border-forest/10">
              <td className="py-2 text-forest">{item.name}</td>
              <td className="py-2 text-center">{item.quantity}×</td>
              <td className="py-2 text-right">{item.price * item.quantity} Kč</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 pt-4 border-t border-forest/20">
        <p className="font-display text-lg text-forest">Celkem: {order.total} Kč</p>
      </div>

      {order.note && (
        <p className="text-sm text-bark/60 mt-6">
          <span className="text-bark/50">Poznámka zákazníka: </span>{order.note}
        </p>
      )}

      <p className="text-xs text-bark/40 mt-10">
        Děkujeme za vaši objednávku. Čaj Koření Káva — Haškova 5/132, 170 00 Praha 7
      </p>
    </div>
  );
}

export default async function OrderContentsPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <>
      <style>{`
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
        }
      `}</style>

      <div className="min-h-screen bg-sand-dark py-10 print:hidden">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <PrintButton />
          </div>
          <div className="border border-forest/20">
            <SlipContent order={order} />
          </div>
        </div>
      </div>

      <div className="hidden print:block">
        <SlipContent order={order} />
      </div>
    </>
  );
}
