import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ListaResueltos({ combates, onCorregir, resueltosCount }) {
  const [open, setOpen] = useState(false);
  if (resueltosCount === 0) return null;

  const resueltos = combates
    .filter((c) => c.resultado != null)
    .sort((a, b) => a.orden - b.orden);

  return (
    <div className="px-4 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-widest text-textoSec font-semibold"
      >
        <span>Combates resueltos ({resueltosCount})</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="space-y-1.5 mt-1">
          {resueltos.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-superficie/50 border border-borde/30"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] text-textoSec font-medium shrink-0 w-4">#{c.orden}</span>
                <span className="text-xs text-texto truncate">{c.ladoA}</span>
                <span className="text-[10px] text-textoSec shrink-0">vs</span>
                <span className="text-xs text-texto truncate">{c.ladoB}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                  c.resultado === "EMPATE" ? "text-vivo" : "text-ganado"
                }`}>
                  {c.resultado === "EMPATE" ? "EMPATE" : c.resultado}
                </span>
                <button
                  onClick={() => onCorregir(c.id)}
                  className="text-[10px] text-acentoFrio underline underline-offset-2 hover:text-texto transition-colors"
                >
                  Corregir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
