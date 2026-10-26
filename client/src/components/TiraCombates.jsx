import { useState, useEffect, useRef } from "react";

export default function TiraCombates({ picks, combates, estado }) {
  const [entered, setEntered] = useState(false);
  const [flipId, setFlipId] = useState(null);
  const prevResults = useRef({});

  useEffect(() => {
    setEntered(true);
  }, []);

  useEffect(() => {
    for (const c of combates) {
      const prev = prevResults.current[c.id];
      if (c.resultado != null && prev == null) {
        setFlipId(c.id);
        setTimeout(() => setFlipId(null), 400);
      }
      prevResults.current[c.id] = c.resultado;
    }
  }, [combates]);

  const sorted = [...combates].sort((a, b) => a.orden - b.orden);
  return (
    <div className="flex gap-[3px]">
      {sorted.map((c, i) => {
        const pick = picks?.[c.id];
        const isIncluded = pick != null;
        let bg = "#1a1a28";
        if (isIncluded) {
          if (c.resultado != null) {
            if (c.resultado === pick) bg = "#3FB68B";
            else bg = "#C4453B";
          } else {
            bg = "#262633";
          }
        }
        const isNextLive = estado === "VIVO" && isIncluded && c.resultado == null && sorted.every(
          (sc) => sc.orden < c.orden ? (picks?.[sc.id] == null || sc.resultado != null) : true
        );
        const doFlip = flipId === c.id;

        return (
          <div
            key={c.id}
            className={`flex-1 h-[18px] rounded-sm transition-colors duration-300 ${
              isNextLive ? "animate-breathingPulse" : ""
            } ${doFlip ? "animate-tiraFlip" : ""} ${
              entered ? "" : "opacity-0"
            }`}
            style={{
              backgroundColor: bg,
              border: !isIncluded ? "1px dashed #262633" : "none",
              opacity: !isIncluded ? 0.35 : undefined,
              animation: entered ? undefined : `tiraEnter var(--dur-base) var(--ease-spring) ${i * 30}ms forwards`,
            }}
            title={`${c.ladoA} vs ${c.ladoB}${isIncluded ? `: ${pick}` : " — No incluido"}`}
            aria-label={`Combate ${c.orden}: ${c.ladoA} vs ${c.ladoB}${isIncluded ? `, pick: ${pick}` : ", no incluido"}`}
          />
        );
      })}
    </div>
  );
}
