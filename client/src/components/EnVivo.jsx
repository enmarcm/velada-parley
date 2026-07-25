import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import Marcador from "./Marcador.jsx";
import CombateActual from "./CombateActual.jsx";
import ListaResueltos from "./ListaResueltos.jsx";
import TiraCombates from "./TiraCombates.jsx";

export default function EnVivo({ state, onSetResultado, onReset, showToast }) {
  const [correcting, setCorrecting] = useState(null);

  const pendientes = state.combates
    .filter((c) => c.resultado == null)
    .sort((a, b) => a.orden - b.orden);

  const resueltosCount = state.resumen.combatesResueltos;

  const current = correcting
    ? state.combates.find((c) => c.id === correcting)
    : pendientes[0] || null;

  const handleResultado = async (combateId, resultado) => {
    await onSetResultado(combateId, resultado);
    setCorrecting(null);
  };

  const handleCorregir = (combateId) => {
    setCorrecting(combateId);
  };

  const handleReset = async () => {
    if (!confirm("¿Reiniciar todos los resultados? Los parleys se conservan.")) return;
    await onReset();
  };

  const topParleys = state.parleys
    .filter((p) => p.estado === "VIVO")
    .sort((a, b) => b.aciertos - a.aciertos)
    .slice(0, 5);

  return (
    <div className="pb-24">
      <Marcador resumen={state.resumen} />

      <div className="px-4 text-xs text-textoSec text-center mt-1 mb-2">
        {pendientes.length > 0
          ? `Aún no empieza. Marca el ganador cuando termine el combate.`
          : `Velada completa`}
      </div>

      <CombateActual
        combate={current}
        onResultado={handleResultado}
        onCorregir={handleCorregir}
      />

      <ListaResueltos
        combates={state.combates}
        onCorregir={handleCorregir}
        resueltosCount={resueltosCount}
      />

      {topParleys.length > 0 && (
        <div className="px-4 mt-4">
          <div className="text-xs uppercase tracking-widest text-textoSec font-semibold mb-2">
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
                <span className="text-[10px] text-vivo font-semibold tabular-nums">{p.aciertos}/10</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {resueltosCount > 0 && (
        <div className="px-4 mt-6">
          <button
            onClick={handleReset}
            className="block mx-auto text-[10px] text-descartado/60 hover:text-descartado transition-colors underline underline-offset-2"
          >
            Reiniciar noche
          </button>
        </div>
      )}
    </div>
  );
}
