import { useState } from "react";
import { X, AlertTriangle, Star, Swords, MinusCircle, Sparkles, Ban } from "lucide-react";
import { crearParley, editarParley, checkDuplicado } from "../api.js";

export default function ParleyModal({ combates, existingParleys, onCreated, onClose, showToast, parleyAEditar }) {
  const isEdit = !!parleyAEditar;
  const [nombre, setNombre] = useState(isEdit ? parleyAEditar.nombre : "");
  const [picks, setPicks] = useState(() => {
    if (isEdit) return { ...parleyAEditar.picks };
    const init = {};
    for (const c of combates) init[c.id] = null;
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [duplicado, setDuplicado] = useState(null);
  const [warningTriunfobet, setWarningTriunfobet] = useState(false);

  const sorted = [...combates].sort((a, b) => a.orden - b.orden);
  const selectedCount = sorted.filter((c) => picks[c.id] != null).length;
  const canSave = selectedCount >= 2;

  const handlePick = (combateId, fighter) => {
    setPicks((prev) => {
      if (prev[combateId] === fighter) {
        return { ...prev, [combateId]: null };
      }
      return { ...prev, [combateId]: fighter };
    });
  };

  const handleIncludeAllPending = () => {
    setPicks((prev) => {
      const next = { ...prev };
      for (const c of combates) {
        if (c.resultado == null && next[c.id] == null) {
          next[c.id] = null;
        }
      }
      return next;
    });
  };

  const handleRemoveResolved = () => {
    setPicks((prev) => {
      const next = { ...prev };
      for (const c of combates) {
        if (c.resultado != null) {
          next[c.id] = null;
        }
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!canSave || saving) return;
    const activePicks = {};
    for (const [cid, pick] of Object.entries(picks)) {
      if (pick != null) activePicks[cid] = pick;
    }

    if (isEdit && parleyAEditar.estadoApuesta === "EN_TRIUNFOBET" && !warningTriunfobet) {
      setWarningTriunfobet(true);
      return;
    }

    const dup = await checkDuplicado(activePicks, isEdit ? parleyAEditar.id : null);
    if (dup.duplicado) {
      setDuplicado(dup.parley);
      return;
    }

    await doSave(activePicks);
  };

  const handleForceSave = async () => {
    if (saving) return;
    setDuplicado(null);
    setWarningTriunfobet(false);
    const activePicks = {};
    for (const [cid, pick] of Object.entries(picks)) {
      if (pick != null) activePicks[cid] = pick;
    }
    await doSave(activePicks);
  };

  const doSave = async (activePicks) => {
    setSaving(true);
    try {
      if (isEdit) {
        await editarParley(parleyAEditar.id, nombre.trim() || null, activePicks);
        showToast("Parley actualizado", "success");
      } else {
        await crearParley(nombre.trim() || null, activePicks);
        showToast("Parley creado", "success");
      }
      onCreated();
    } catch (e) {
      showToast(e.message || "Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSeeExisting = () => {
    onClose();
  };

  if (duplicado) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-superficie border border-borde rounded-2xl p-6 max-w-sm w-full">
          <div className="flex items-center gap-2 text-vivo mb-3">
            <AlertTriangle size={20} />
            <h2 className="font-display text-lg">Duplicado</h2>
          </div>
          <p className="text-sm text-texto mb-1">
            Estos picks coinciden con <strong className="text-vivo">{duplicado.nombre}</strong>
          </p>
          <p className="text-xs text-textoSec mb-6">Guardar igualmente?</p>
          <div className="flex gap-2">
            <button
              onClick={handleSeeExisting}
              className="flex-1 py-2.5 rounded-xl border border-borde text-xs font-semibold text-texto hover:bg-superficie/80 transition-colors"
            >
              {isEdit ? "Volver a editar" : "Ver el que ya tengo"}
            </button>
            <button
              onClick={handleForceSave}
              className="flex-1 py-2.5 rounded-xl bg-vivo text-fondo text-xs font-semibold hover:bg-vivo/90 transition-colors"
            >
              Guardar igualmente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (warningTriunfobet) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-superficie border border-borde rounded-2xl p-6 max-w-sm w-full">
          <div className="flex items-center gap-2 text-ganado mb-3">
            <AlertTriangle size={20} />
            <h2 className="font-display text-lg">Aviso</h2>
          </div>
          <p className="text-sm text-texto mb-6">
            Este parley ya est registrado en TriunfoBet. Si lo editas aqu, dejar de coincidir con la apuesta real.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-borde text-xs font-semibold text-texto hover:bg-superficie/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleForceSave}
              className="flex-1 py-2.5 rounded-xl bg-vivo text-fondo text-xs font-semibold hover:bg-vivo/90 transition-colors"
            >
              Editar igualmente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-superficie border border-borde rounded-t-2xl sm:rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto scrollbar-none animate-bottomSheetIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-borde/50 sticky top-0 bg-superficie z-10">
          <h2 className="font-display text-lg text-texto">{isEdit ? "Editar parley" : "Nuevo parley"}</h2>
          <button onClick={onClose} className="text-textoSec hover:text-texto transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-textoSec font-semibold mb-1.5 block">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={`MI PARLEY #${(existingParleys?.length || 19) + 1}`}
              className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm text-texto placeholder:text-textoSec/50 focus:outline-none focus:border-vivo/50 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-textoSec font-semibold">
                Combates
              </span>
              <span className={`text-xs font-semibold tabular-nums ${
                selectedCount >= 2 ? "text-vivo" : "text-textoSec"
              }`}>
                {selectedCount} seleccionados
              </span>
            </div>
            <div className="flex gap-1.5 mb-3">
              <button
                onClick={handleIncludeAllPending}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold text-acentoFrio bg-acentoFrio/10 border border-acentoFrio/30 hover:bg-acentoFrio/20 transition-colors"
              >
                <Sparkles size={10} />
                Incluir pendientes
              </button>
              <button
                onClick={handleRemoveResolved}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold text-textoSec bg-fondo border border-borde/50 hover:border-borde transition-colors"
              >
                <Ban size={10} />
                Quitar resueltos
              </button>
            </div>
            <div className="space-y-2">
              {sorted.map((c) => {
                const currentPick = picks[c.id];
                const isResolved = c.resultado != null;
                return (
                  <div key={c.id} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-textoSec font-medium w-4 shrink-0 tabular-nums">#{c.orden}</span>
                    <button
                      onClick={() => handlePick(c.id, c.ladoA)}
                      className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-medium border transition-all duration-100 min-w-0 flex-1 ${
                        currentPick === c.ladoA
                          ? "bg-vivo/15 border-vivo text-vivo"
                          : "bg-fondo border-borde/60 text-texto hover:border-borde"
                      } ${isResolved && currentPick !== c.ladoA ? "opacity-40" : ""}`}
                    >
                      <Star size={10} className="shrink-0" />
                      <span className="truncate">{c.ladoA}</span>
                    </button>
                    <span className="text-[8px] text-textoSec/60 uppercase shrink-0">VS</span>
                    <button
                      onClick={() => handlePick(c.id, c.ladoB)}
                      className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-medium border transition-all duration-100 min-w-0 flex-1 ${
                        currentPick === c.ladoB
                          ? "bg-vivo/15 border-vivo text-vivo"
                          : "bg-fondo border-borde/60 text-texto hover:border-borde"
                      } ${isResolved && currentPick !== c.ladoB ? "opacity-40" : ""}`}
                    >
                      <Swords size={10} className="shrink-0" />
                      <span className="truncate">{c.ladoB}</span>
                    </button>
                    <button
                      onClick={() => handlePick(c.id, null)}
                      className={`py-2 px-1.5 rounded-lg text-[9px] border transition-all duration-100 shrink-0 ${
                        currentPick == null
                          ? "border-borde/30 text-textoSec/50 bg-fondo"
                          : "border-transparent text-textoSec/30 hover:text-textoSec/60"
                      }`}
                      title="No incluir"
                    >
                      <MinusCircle size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-borde/50">
          <button
            onClick={handleSubmit}
            disabled={!canSave || saving}
            className="w-full py-3 rounded-xl bg-vivo text-fondo font-semibold text-sm disabled:opacity-30 hover:bg-vivo/90 transition-all duration-150"
          >
            {saving ? "Guardando..." : canSave ? "Guardar cambios" : `Selecciona al menos 2 combates (${selectedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}
