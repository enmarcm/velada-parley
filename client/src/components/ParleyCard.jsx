import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Pencil, Check, X, Circle, CheckCircle2, Clock } from "lucide-react";
import TiraCombates from "./TiraCombates.jsx";

export default function ParleyCard({ parley, combates, onDelete, onEdit, onToggleApuesta, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isVivo = parley.estado === "VIVO";
  const isGanado = parley.estado === "GANADO";
  const isDescartado = parley.estado === "DESCARTADO";
  const isEnTriunfobet = parley.estadoApuesta === "EN_TRIUNFOBET";

  const badgeColor = isVivo
    ? "text-vivo border-vivo/30 bg-vivo/10"
    : isGanado
    ? "text-ganado border-ganado/30 bg-ganado/10"
    : "text-descartado border-descartado/30 bg-descartado/10";

  const handleDelete = async () => {
    if (deleting) return;
    if (!confirm(`¿Eliminar «${parley.nombre}»? No se puede deshacer.`)) return;
    setDeleting(true);
    await onDelete(parley.id);
  };

  const handleToggleApuesta = async (e) => {
    e.stopPropagation();
    if (toggling) return;
    setToggling(true);
    const newVal = isEnTriunfobet ? "POR_METER" : "EN_TRIUNFOBET";
    await onToggleApuesta(parley.id, newVal, parley.estadoApuesta);
    setToggling(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(parley);
  };

  const sorted = [...combates].sort((a, b) => a.orden - b.orden);

  return (
    <div className={`rounded-2xl border ${
      isDescartado ? "border-borde/20 opacity-60" : "border-borde"
    } bg-superficie overflow-hidden transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-base text-texto truncate">{parley.nombre}</span>
            <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${badgeColor}`}>
              {parley.estado}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-textoSec">
            <span className="tabular-nums">{parley.aciertos}/{combates.length}</span>
            <span>{parley.pendientes} pendiente{parley.pendientes !== 1 ? "s" : ""}</span>
            {parley.prob != null && (
              <>
                <span>·</span>
                <span>prob {(parley.prob * 100).toFixed(2)}%</span>
              </>
            )}
          </div>
          {isVivo && parley.dependeDe && (
            <div className="text-[10px] text-vivo mt-1 font-medium">
              Depende de: {parley.dependeDe.nombre}
            </div>
          )}
          <div className="mt-2">
            <TiraCombates picks={parley.picks} combates={combates} estado={parley.estado} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleToggleApuesta}
              disabled={toggling}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider transition-all duration-150 ${
                isEnTriunfobet
                  ? "bg-ganado/15 text-ganado border border-ganado/30"
                  : "bg-transparent text-vivo border border-vivo/40"
              }`}
            >
              {isEnTriunfobet ? <CheckCircle2 size={10} /> : <Clock size={10} />}
              {isEnTriunfobet ? "EN TRIUNFOBET" : "POR METER"}
            </button>
          </div>
        </div>
        <div className="shrink-0 mt-0.5 text-textoSec">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-1.5">
          {sorted.map((c) => {
            const pick = parley.picks[c.id];
            let icon, color;
            if (c.resultado == null) {
              icon = <Circle size={12} />;
              color = "text-textoSec/50";
            } else if (c.resultado === pick) {
              icon = <Check size={12} />;
              color = "text-ganado";
            } else {
              icon = <X size={12} />;
              color = "text-descartado";
            }
            return (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                <span className={`w-4 ${color}`}>{icon}</span>
                <span className="text-textoSec font-medium w-4 tabular-nums">#{c.orden}</span>
                <span className="text-texto">{c.ladoA}</span>
                <span className="text-textoSec text-[10px]">vs</span>
                <span className="text-texto">{c.ladoB}</span>
                <span className="text-textoSec ml-auto">
                  {pick ? pick : "—"}
                </span>
              </div>
            );
          })}
          <div className="flex items-center gap-3 pt-2 border-t border-borde/20 mt-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 text-[10px] text-textoSec hover:text-texto transition-colors py-2 px-1"
            >
              <Pencil size={12} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-[10px] text-descartado hover:text-red-400 transition-colors disabled:opacity-50 py-2 px-1"
            >
              <Trash2 size={12} />
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
