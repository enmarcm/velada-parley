import { useState } from "react";
import { Plus } from "lucide-react";
import ParleyCard from "./ParleyCard.jsx";
import NuevoParleyModal from "./NuevoParleyModal.jsx";
import { borrarParley } from "../api.js";

export default function ParleysView({ state, onRefresh, showToast }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id) => {
    try {
      await borrarParley(id);
      showToast("Parley eliminado", "info");
      onRefresh();
    } catch (e) {
      showToast("Error al eliminar", "error");
    }
  };

  const handleCreated = () => {
    setShowModal(false);
    onRefresh();
  };

  return (
    <div className="pt-4 pb-24 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl text-texto tracking-tight">PARLEYS</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-vivo/10 border border-vivo/30 text-vivo text-xs font-semibold hover:bg-vivo/20 transition-colors"
        >
          <Plus size={14} />
          Nuevo
        </button>
      </div>

      <div className="flex gap-3 text-sm font-semibold mb-4">
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

      <div className="space-y-2.5">
        {state.parleys.map((p) => (
          <ParleyCard
            key={p.id}
            parley={p}
            combates={state.combates}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {showModal && (
        <NuevoParleyModal
          combates={state.combates}
          existingParleys={state.parleys}
          onCreated={handleCreated}
          onClose={() => setShowModal(false)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
