import { useState, useEffect, useRef } from "react";
import { Trophy, RotateCcw, Star, Swords } from "lucide-react";

export default function CombateActual({ combate, onResultado, animKey }) {
  const [sending, setSending] = useState(false);
  const [slideDir, setSlideDir] = useState("right");
  const [justResolved, setJustResolved] = useState(false);
  const prevOrden = useRef(combate?.orden);
  const prevResultado = useRef(combate?.resultado);

  useEffect(() => {
    if (prevOrden.current && combate) {
      setSlideDir(combate.orden > prevOrden.current ? "right" : "left");
    }
    prevOrden.current = combate?.orden;
    if (combate?.resultado && !prevResultado.current) {
      setJustResolved(true);
      setTimeout(() => setJustResolved(false), 400);
    }
    prevResultado.current = combate?.resultado;
  }, [combate?.orden, combate?.resultado]);

  if (!combate) {
    return (
      <div className="text-center py-16 px-4 animate-fadeIn">
        <Trophy size={48} className="mx-auto text-vivo mb-4 opacity-60" />
        <div className="font-display text-3xl text-vivo mb-2">VELADA COMPLETA</div>
        <p className="text-textoSec text-sm">Todos los combates están resueltos</p>
      </div>
    );
  }

  const isResolved = combate.resultado != null;
  const winner = combate.resultado;

  const handlePick = async (fighter) => {
    if (sending) return;
    setSending(true);
    await onResultado(combate.id, fighter);
    setSending(false);
  };

  const handleEmpate = async () => {
    if (sending) return;
    setSending(true);
    await onResultado(combate.id, "EMPATE");
    setSending(false);
  };

  const handleUnset = async () => {
    if (sending) return;
    setSending(true);
    await onResultado(combate.id, null);
    setSending(false);
  };

  const slideClass = justResolved ? "animate-slideUp" : `animate-slideInFrom${slideDir === "right" ? "Right" : "Left"}`;

  return (
    <div key={animKey || combate.id} className={`px-4 py-4 ${slideClass}`}>
      <div className="text-center mb-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-textoSec font-semibold">
          Combate {combate.orden} de 10
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handlePick(combate.ladoA)}
          disabled={sending || (isResolved && winner !== combate.ladoA)}
          className={`w-full py-5 px-4 rounded-2xl border-2 transition-all duration-[160ms] text-center ${
            isResolved && winner === combate.ladoA
              ? "bg-ganado/15 border-ganado/50 text-ganado"
              : isResolved && winner !== combate.ladoA
              ? "bg-superficie border-borde/20 text-textoSec/50"
              : "bg-superficie border-borde active:scale-[0.97] active:border-vivo/50 hover:border-vivo/30"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Star size={14} className="shrink-0 text-vivo/70" />
            <span className="font-display text-2xl">{combate.ladoA}</span>
          </div>
          <div className="mt-0.5 h-[1rem] flex items-center justify-center">
            <span className="text-[10px] text-textoSec uppercase tracking-wider">Favorito</span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-borde/50 to-transparent" />
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${
            isResolved ? "text-textoSec" : "text-vivo"
          }`}>
            {isResolved ? winner === "EMPATE" ? "EMPATE" : winner : "VS"}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-borde/50 to-transparent" />
        </div>

        <button
          onClick={() => handlePick(combate.ladoB)}
          disabled={sending || (isResolved && winner !== combate.ladoB)}
          className={`w-full py-5 px-4 rounded-2xl border-2 transition-all duration-[160ms] text-center ${
            isResolved && winner === combate.ladoB
              ? "bg-ganado/15 border-ganado/50 text-ganado"
              : isResolved && winner !== combate.ladoB
              ? "bg-superficie border-borde/20 text-textoSec/50"
              : "bg-superficie border-borde active:scale-[0.97] active:border-vivo/50 hover:border-vivo/30"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Swords size={14} className="shrink-0 text-textoSec/60" />
            <span className="font-display text-2xl">{combate.ladoB}</span>
          </div>
          <div className="mt-0.5 h-[1rem] flex items-center justify-center">
            <span className="text-[10px] text-textoSec/50 uppercase tracking-wider">Retador</span>
          </div>
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        {!isResolved && (
          <button
            onClick={() => { navigator.vibrate?.(10); handleEmpate(); }}
            disabled={sending}
            className="text-xs text-textoSec hover:text-texto transition-colors underline underline-offset-2 decoration-borde disabled:opacity-50"
          >
            Empate
          </button>
        )}
        {isResolved && (
          <button
            onClick={handleUnset}
            disabled={sending}
            className="flex items-center gap-1 text-xs text-vivo/60 hover:text-vivo transition-colors disabled:opacity-50"
          >
            <RotateCcw size={12} />
            Corregir
          </button>
        )}
      </div>
    </div>
  );
}
