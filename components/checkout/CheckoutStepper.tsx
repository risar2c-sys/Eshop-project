import { Check } from "lucide-react";
const steps = ["Kontakt", "Doručení", "Platba", "Rekapitulace"];

export default function CheckoutStepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center justify-between mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        return (
          <li key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${done ? "bg-forest text-sand border-forest" : active ? "border-forest text-forest" : "border-forest/20 text-bark/40"}`}>
                {done ? <Check size={16} /> : stepNum}
              </div>
              <span className={`text-xs ${active || done ? "text-forest" : "text-bark/40"}`}>{label}</span>
            </div>
            {stepNum < steps.length && <div className={`flex-1 h-px mx-2 ${done ? "bg-forest" : "bg-forest/15"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
