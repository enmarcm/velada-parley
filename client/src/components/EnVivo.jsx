import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import Marcador from "./Marcador.jsx";
import CombateActual from "./CombateActual.jsx";
import SelectorCombates from "./SelectorCombates.jsx";
import TiraCombates from "./TiraCombates.jsx";

export default function EnVivo({ state, onSetResultado, onReset }) {
  const [selectedId, setSelectedId] = useState(null);

  const sorted = [...state.combates].sort((a, b) => a.orden - b.orden);
  const pendientes = sorted.filter((c) => c.resultado == null);

  const selected = selectedId
    ? sorted.find((c) => c.id === selectedId)
    : pendientes[0] || sorted[sorted.length - 1];

  const resueltosCount = state.resumen.combatesResueltos;

  const handleResultado = async (combateId, resultado) => {
    await onSetResultado(combateId, resultado);
  };

  const topParleys = state.parleys
    .filter((p) => p.estado === "VIVO")
    .sort((a, b) => b.aciertos - a.aciertos)
    .slice(0, 5);

  return (
    <div className="pb-24">
      <Marcador resumen={state.resumen} />

      <SelectorCombates
        combates={sorted}
        selected={selected}
        onSelect={setSelectedId}
        resueltosCount={resueltosCount}
      />

      <div className="mx-4 mb-3 bg-superficie border border-borde rounded-2xl overflow-hidden" style={{ boxShadow: "0 0 40px -12px rgba(245,166,35,0.25)" }}>
        <CombateActual
          key={selected.id}
          combate={selected}
          onResultado={handleResultado}
          animKey={selected.id}
        />
      </div>

      {topParleys.length > 0 && (
        <div className="px-4 mt-4">
          <div className="text-xs uppercase tracking-widest text-textoSec font-semibold mb-2 px-1">
            Vivos al frente
          </div>
          <div className="space-y-2">
            {topParleys.map((p) => (
              <div key={p.id} className="flex items-center gap-2 py-2 px-3 rounded-xl bg-superficie/50 border border-borde/20">
                <span className="font-display text-sm text-texto min-w-[60px] truncate">{p.nombre}</span>
                <span className="shrink-0">
                  {p.estadoApuesta === "EN_TRIUNFOBET"
                    ? <CheckCircle2 size={10} className="text-ganado" />
                    : <Clock size={10} className="text-vivo" />}
                </span>
                <div className="flex-1">
                  <TiraCombates picks={p.picks} combates={state.combates} estado={p.estado} />
                </div>
                <span className="text-[10px] text-vivo font-semibold tabular-nums">{p.aciertos}/{Object.keys(p.picks).length}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {resueltosCount > 0 && (
        <div className="px-4 mt-6">
          <button
            onClick={onReset}
            className="block mx-auto text-[10px] text-descartado/60 hover:text-descartado transition-colors underline underline-offset-2"
          >
            Reiniciar noche
          </button>
        </div>
      )}
    </div>
  );
}
