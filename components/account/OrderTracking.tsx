import { demoOrders } from "@/lib/orders";
import { Check, Package, Truck, Home } from "lucide-react";
const steps = [{ key: "zpracovává se", label: "Přijato", icon: Package }, { key: "expedováno", label: "Expedováno", icon: Truck }, { key: "doručeno", label: "Doručeno", icon: Home }] as const;

export default function OrderTracking() {
  const latest = demoOrders[demoOrders.length - 1];
  const currentIndex = steps.findIndex((s) => s.key === latest.status);
  return (
    <div className="bg-white border border-forest/10 rounded-organic p-6">
      <p className="label-tag mb-1">Sledování objednávky</p>
      <p className="font-display text-lg text-forest mb-6">{latest.id}</p>
      <div className="flex items-center">
        {steps.map((step, i) => {
          const Icon = step.icon; const done = i <= currentIndex;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? "bg-forest text-sand" : "bg-forest/10 text-bark/40"}`}>
                  {done && i < currentIndex ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span className={`text-xs ${done ? "text-forest" : "text-bark/40"}`}>{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 ${i < currentIndex ? "bg-forest" : "bg-forest/15"}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
