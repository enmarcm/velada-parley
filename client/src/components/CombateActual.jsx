import { useState } from "react";

export default function CombateActual({ combate, onResultado, onCorregir }) {
  const [sending, setSending] = useState(false);

  if (!combate) {
    return (
      <div className="text-center py-12 px-4">
        <div className="font-display text-3xl text-vivo mb-2">VELADA COMPLETA</div>
        <p className="text-textoSec text-sm">Todos los combates están resueltos</p>
      </div>
    );
  }

  const handlePick = async (winner) => {
    if (sending) return;
    setSending(true);
    await onResultado(combate.id, winner);
    setSending(false);
  };

  const handleEmpate = async () => {
    if (sending) return;
    setSending(true);
    await onResultado(combate.id, "EMPATE");
    setSending(false);
  };

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-textoSec font-semibold">
          Combate {combate.orden}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handlePick(combate.ladoA)}
          disabled={sending}
          className="w-full py-5 px-4 rounded-2xl bg-superficie border border-borde active:border-vivo/50 transition-all duration-150 text-center disabled:opacity-50"
        >
          <span className="font-display text-2xl text-texto">{combate.ladoA}</span>
          {combate.ladoB && (
            <span className="block text-[11px] text-textoSec mt-1 uppercase tracking-wider">Favorito</span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-borde/50" />
          <span className="text-[10px] uppercase tracking-widest text-textoSec font-semibold">VS</span>
          <div className="flex-1 h-px bg-borde/50" />
        </div>

        <button
          onClick={() => handlePick(combate.ladoB)}
          disabled={sending}
          className="w-full py-5 px-4 rounded-2xl bg-superficie border border-borde active:border-vivo/50 transition-all duration-150 text-center disabled:opacity-50"
        >
          <span className="font-display text-2xl text-texto">{combate.ladoB}</span>
        </button>
      </div>

      <button
        onClick={handleEmpate}
        disabled={sending}
        className="block mx-auto mt-4 text-xs text-textoSec hover:text-texto transition-colors underline underline-offset-2 decoration-borde disabled:opacity-50"
      >
        Empate
      </button>
    </div>
  );
}
