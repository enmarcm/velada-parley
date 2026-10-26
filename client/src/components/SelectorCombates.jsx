import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SelectorCombates({ combates, selected, onSelect, resueltosCount }) {
  const sorted = [...combates].sort((a, b) => a.orden - b.orden);
  const idx = sorted.findIndex((c) => c.id === selected?.id);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => prev && onSelect(prev.id)}
          disabled={!prev}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-borde/50 text-textoSec hover:text-texto hover:border-borde transition-all disabled:opacity-20 disabled:cursor-default"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 flex justify-center gap-1.5">
          {sorted.map((c) => {
            const isResolved = c.resultado != null;
            const isSelected = c.id === selected?.id;
            const isPending = !isResolved && !isSelected;
            return (
              <button
                key={c.id}
                onClick={() => onSelect(c.id)}
                className={`w-7 h-7 rounded-full text-[10px] font-bold transition-all duration-300 ${
                  isSelected
                    ? "bg-vivo text-fondo scale-110 ring-2 ring-vivo/30"
                    : isResolved
                    ? "bg-ganado/80 text-white"
                    : "bg-superficie border border-borde/50 text-textoSec hover:border-vivo/50"
                }`}
                title={`Combate ${c.orden}: ${c.ladoA} vs ${c.ladoB}${isResolved ? ` → ${c.resultado}` : ""}`}
              >
                {c.orden}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => next && onSelect(next.id)}
          disabled={!next}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-borde/50 text-textoSec hover:text-texto hover:border-borde transition-all disabled:opacity-20 disabled:cursor-default"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
