import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PrintButton from "@/components/admin/PrintButton";

export default async function OrderLabelPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-sand-dark py-10 print:bg-white print:py-0">
      <style>{`
        @page { size: 105mm 148mm; margin: 6mm; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="max-w-sm mx-auto print:max-w-none print:mx-0">
        <div className="mb-4 print:hidden">
          <PrintButton />
        </div>

        <div
          className="bg-white border border-forest/20 p-5 print:border-black print:p-0"
          style={{ width: "105mm", minHeight: "148mm" }}
        >
          <p className="text-[10px] uppercase tracking-widest text-bark/50 mb-1">Odesílatel</p>
          <p className="text-xs text-bark/80 mb-4">
            Čaj Koření Káva<br />
            Haškova 5/132, 170 00 Praha 7
          </p>

          <div className="border-t border-b border-forest/20 py-4 my-3">
            <p className="text-[10px] uppercase tracking-widest text-bark/50 mb-1">Příjemce</p>
            <p className="font-display text-lg text-forest leading-snug">
              {order.firstName} {order.lastName}
            </p>
            <p className="text-sm text-bark/80 mt-1">
              {order.street}<br />
              {order.zip} {order.city}
            </p>
            <p className="text-sm text-bark/60 mt-2">{order.phone}</p>
          </div>

          <p className="text-xs text-bark/70 mb-1">
            <strong>Objednávka:</strong> {order.orderNumber}
          </p>
          <p className="text-xs text-bark/70 mb-3">
            <strong>Doprava:</strong> {order.shippingMethod}
          </p>

          <div className="text-xs text-bark/70">
            {order.items.map((item) => (
              <p key={item.id}>{item.quantity}× {item.name}</p>
            ))}
          </div>

          {order.note && (
            <p className="text-xs text-bark/50 mt-3 italic">Poznámka: {order.note}</p>
          )}
        </div>
      </div>
    </div>
  );
}
