import { useState, useEffect, useRef } from "react";

function useContador(valor) {
  const [display, setDisplay] = useState(valor);
  const prev = useRef(valor);
  const raf = useRef();

  useEffect(() => {
    if (prev.current === valor) return;
    const from = prev.current;
    const diff = valor - from;
    const steps = Math.abs(diff);
    if (steps === 0) return;
    const dur = 380;
    const stepTime = Math.max(dur / steps, 20);
    let step = 0;
    const tick = () => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + diff * eased);
      setDisplay(current);
      if (step < steps) {
        raf.current = setTimeout(tick, stepTime);
      }
    };
    tick();
    prev.current = valor;
    return () => clearTimeout(raf.current);
  }, [valor]);

  return display;
}

export default function Marcador({ resumen, changedKey }) {
  const displayVivos = useContador(resumen.vivos);
  const displayDescartados = useContador(resumen.descartados);
  const displayGanados = useContador(resumen.ganados);

  const [flash, setFlash] = useState(null);
  const prevVivos = useRef(resumen.vivos);
  const prevDescartados = useRef(resumen.descartados);
  const prevGanados = useRef(resumen.ganados);
  const [pulseKey, setPulseKey] = useState(null);

  useEffect(() => {
    if (resumen.descartados > prevDescartados.current) {
      setFlash("red");
      setPulseKey("d");
      setTimeout(() => { setFlash(null); setPulseKey(null); }, 500);
    } else if (resumen.ganados > prevGanados.current) {
      setFlash("green");
      setPulseKey("g");
      setTimeout(() => { setFlash(null); setPulseKey(null); }, 500);
    } else if (resumen.vivos !== prevVivos.current) {
      setPulseKey("v");
      setTimeout(() => setPulseKey(null), 300);
    }
    prevVivos.current = resumen.vivos;
    prevDescartados.current = resumen.descartados;
    prevGanados.current = resumen.ganados;
  }, [resumen.vivos, resumen.descartados, resumen.ganados]);

  return (
    <div className={`sticky top-0 z-40 bg-fondo/90 backdrop-blur-xl border-b border-borde/30 pt-3 pb-4 px-4 transition-all duration-240 ${flash === "red" ? "animate-flashRed" : flash === "green" ? "animate-flashGreen" : ""}`}>
      <div className="flex justify-center items-center gap-8 mb-1">
        <div className="text-center">
          <div key={pulseKey === "v" ? "v-pulse" : "v"} className={`font-display text-5xl text-vivo tabular-nums leading-none tracking-[-0.02em] ${pulseKey === "v" ? "animate-countPulse" : ""}`}>
            {displayVivos}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-vivo/70 font-semibold mt-1">
            Vivos
          </div>
        </div>
        {resumen.ganados > 0 && (
          <div className="text-center">
            <div key={pulseKey === "g" ? "g-pulse" : "g"} className={`font-display text-5xl text-ganado tabular-nums leading-none tracking-[-0.02em] ${pulseKey === "g" ? "animate-countPulse" : ""}`}>
              {displayGanados}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-ganado/70 font-semibold mt-1">
              Ganados
            </div>
          </div>
        )}
        <div className="text-center">
          <div key={pulseKey === "d" ? "d-pulse" : "d"} className={`font-display text-5xl text-descartado tabular-nums leading-none tracking-[-0.02em] ${pulseKey === "d" ? "animate-countPulse" : ""}`}>
            {displayDescartados}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-descartado/70 font-semibold mt-1">
            Descartados
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-textoSec font-medium">
        de {resumen.total} parleys · {resumen.combatesResueltos}/10 combates
      </div>
    </div>
  );
}
