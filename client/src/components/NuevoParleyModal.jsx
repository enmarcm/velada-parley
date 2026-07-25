import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { crearParley, checkDuplicado } from "../api.js";

export default function NuevoParleyModal({ combates, existingParleys, onCreated, onClose, showToast }) {
  const [nombre, setNombre] = useState("");
  const [picks, setPicks] = useState({});
  const [saving, setSaving] = useState(false);
  const [duplicado, setDuplicado] = useState(null);

  const sorted = [...combates].sort((a, b) => a.orden - b.orden);
  const pickedCount = sorted.filter((c) => picks[c.id]).length;

  const handleToggle = (combateId, fighter) => {
    setPicks((prev) => {
      if (prev[combateId] === fighter) {
        const next = { ...prev };
        delete next[combateId];
        return next;
      }
      return { ...prev, [combateId]: fighter };
    });
  };

  const allPicked = pickedCount === combates.length;

  const handleCheckDuplicado = async () => {
    if (!allPicked) return;
    try {
      const result = await checkDuplicado(picks);
      if (result.duplicado) {
        setDuplicado(result.parley);
        return true;
      }
    } catch {}
    return false;
  };

  const handleSubmit = async () => {
    if (!allPicked || saving) return;

    if (!duplicado) {
      const isDup = await handleCheckDuplicado();
      if (isDup) return;
    }

    setSaving(true);
    try {
      await crearParley(nombre.trim() || null, picks);
      showToast("Parley creado", "success");
      onCreated();
    } catch (e) {
      showToast(e.message || "Error al crear", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleForceCreate = async () => {
    setDuplicado(null);
    setSaving(true);
    try {
      await crearParley(nombre.trim() || null, picks);
      showToast("Parley creado", "success");
      onCreated();
    } catch (e) {
      showToast(e.message || "Error al crear", "error");
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
            Este parley ya lo tienes: <strong className="text-vivo">{duplicado.nombre}</strong>
          </p>
          <p className="text-xs text-textoSec mb-6">¿Crear otro igual de todas formas?</p>
          <div className="flex gap-2">
            <button
              onClick={handleSeeExisting}
              className="flex-1 py-2.5 rounded-xl border border-borde text-xs font-semibold text-texto hover:bg-superficie/80 transition-colors"
            >
              Ver el que ya tengo
            </button>
            <button
              onClick={handleForceCreate}
              className="flex-1 py-2.5 rounded-xl bg-vivo text-fondo text-xs font-semibold hover:bg-vivo/90 transition-colors"
            >
              Crear igualmente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-superficie border border-borde rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto scrollbar-none">
        <div className="flex items-center justify-between p-4 border-b border-borde/50 sticky top-0 bg-superficie z-10">
          <h2 className="font-display text-lg text-texto">Nuevo parley</h2>
          <button onClick={onClose} className="text-textoSec hover:text-texto transition-colors">
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
              placeholder={`MI PARLEY #${(existingParleys?.length || 15) + 1}`}
              className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm text-texto placeholder:text-textoSec/50 focus:outline-none focus:border-vivo/50 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-textoSec font-semibold">
                Picks por combate
              </span>
              <span className="text-xs text-vivo font-semibold">{pickedCount}/10 elegidos</span>
            </div>
            <div className="space-y-2">
              {sorted.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-textoSec font-medium w-4 shrink-0">#{c.orden}</span>
                  <button
                    onClick={() => handleToggle(c.id, c.ladoA)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      picks[c.id] === c.ladoA
                        ? "bg-vivo/15 border-vivo text-vivo"
                        : "bg-fondo border-borde text-texto hover:border-borde/50"
                    }`}
                  >
                    {c.ladoA}
                  </button>
                  <span className="text-[9px] text-textoSec uppercase tracking-wider shrink-0">VS</span>
                  <button
                    onClick={() => handleToggle(c.id, c.ladoB)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      picks[c.id] === c.ladoB
                        ? "bg-vivo/15 border-vivo text-vivo"
                        : "bg-fondo border-borde text-texto hover:border-borde/50"
                    }`}
                  >
                    {c.ladoB}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-borde/50">
          <button
            onClick={handleSubmit}
            disabled={!allPicked || saving}
            className="w-full py-3 rounded-xl bg-vivo text-fondo font-semibold text-sm disabled:opacity-30 hover:bg-vivo/90 transition-all duration-150"
          >
            {saving ? "Guardando…" : allPicked ? "Guardar parley" : `Elige los 10 combates (${pickedCount}/10)`}
          </button>
        </div>
      </div>
    </div>
  );
}
