import type { AromaNote } from "@/lib/data";

export default function AromaProfile({ notes, size = 88 }: { notes: AromaNote[]; size?: number }) {
  if (!notes || notes.length === 0) return null;
  const center = size / 2;
  const maxRadius = size / 2 - 10;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[0.33, 0.66, 1].map((r) => (
          <circle key={r} cx={center} cy={center} r={maxRadius * r} fill="none" stroke="#6B7259" strokeOpacity={0.2} strokeWidth={1} />
        ))}
        {notes.map((note, i) => {
          const angle = (Math.PI * 2 * i) / notes.length - Math.PI / 2;
          const r = maxRadius * note.intensity;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <g key={note.label}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="#B08D57" strokeWidth={1.5} />
              <circle cx={x} cy={y} r={3.5} fill="#1F2E22" />
            </g>
          );
        })}
      </svg>
      <ul className="text-xs text-bark/80 leading-relaxed">
        {notes.map((n) => <li key={n.label} className="capitalize">{n.label}</li>)}
      </ul>
    </div>
  );
}
