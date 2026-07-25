import { useState } from "react";
import { Plus } from "lucide-react";
import ParleyCard from "./ParleyCard.jsx";
import ParleyModal from "./ParleyModal.jsx";
import { borrarParley, actualizarEstadoApuesta, enqueuePending } from "../api.js";

export default function ParleysView({ state, onRefresh, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editParley, setEditParley] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const handleDelete = async (id) => {
    try {
      await borrarParley(id);
      showToast("Parley eliminado", "info");
      onRefresh();
    } catch (e) {
      showToast("Error al eliminar", "error");
    }
  };

  const handleToggleApuesta = async (id, newVal, oldVal) => {
    try {
      const data = await actualizarEstadoApuesta(id, newVal);
      showToast(newVal === "EN_TRIUNFOBET" ? "Marcado en TriunfoBet" : "Marcado como por meter", "success");
      onRefresh();
    } catch (e) {
      showToast("Error al cambiar estado", "error");
    }
  };

  const handleEdit = (parley) => {
    setEditParley(parley);
    setShowModal(true);
  };

  const handleCreated = () => {
    setShowModal(false);
    setEditParley(null);
    onRefresh();
  };

  const filteredParleys = state.parleys.filter((p) => {
    if (filtro === "entriunfobet") return p.estadoApuesta === "EN_TRIUNFOBET";
    if (filtro === "pormeter") return p.estadoApuesta === "POR_METER";
    return true;
  });

  const filtros = [
    { id: "todos", label: "Todos" },
    { id: "entriunfobet", label: "En TriunfoBet" },
    { id: "pormeter", label: "Por meter" },
  ];

  return (
    <div className="pt-4 pb-24 px-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl text-texto tracking-tight">PARLEYS</h1>
        <button
          onClick={() => { setEditParley(null); setShowModal(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-vivo/10 border border-vivo/30 text-vivo text-xs font-semibold hover:bg-vivo/20 transition-colors"
        >
          <Plus size={14} />
          Nuevo
        </button>
      </div>

      <div className="flex gap-3 text-sm font-semibold mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-vivo font-display text-lg tabular-nums">{state.resumen.vivos}</span>
          <span className="text-textoSec text-[10px] uppercase tracking-wider">Vivos</span>
        </div>
        {state.resumen.ganados > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-ganado font-display text-lg tabular-nums">{state.resumen.ganados}</span>
            <span className="text-textoSec text-[10px] uppercase tracking-wider">Ganados</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-descartado font-display text-lg tabular-nums">{state.resumen.descartados}</span>
          <span className="text-textoSec text-[10px] uppercase tracking-wider">Descartados</span>
        </div>
        <div className="flex-1" />
        <span className="text-textoSec text-xs self-end">{state.resumen.total} total</span>
      </div>

      <div className="text-[10px] text-textoSec font-medium mb-2">
        {state.resumen.enTriunfobet} en TriunfoBet · {state.resumen.porMeter} por meter
      </div>

      <div className="flex gap-1.5 mb-4">
        {filtros.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              filtro === f.id
                ? "bg-vivo/20 text-vivo border border-vivo/40"
                : "text-textoSec border border-borde/50 hover:text-texto"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filteredParleys.map((p) => (
          <ParleyCard
            key={p.id}
            parley={p}
            combates={state.combates}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleApuesta={handleToggleApuesta}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      {showModal && (
        <ParleyModal
          combates={state.combates}
          existingParleys={state.parleys}
          onCreated={handleCreated}
          onClose={() => { setShowModal(false); setEditParley(null); }}
          showToast={showToast}
          parleyAEditar={editParley}
        />
      )}
    </div>
  );
}
