export default function TiraCombates({ picks, combates, estado }) {
  const sorted = [...combates].sort((a, b) => a.orden - b.orden);
  return (
    <div className="flex gap-[3px]">
      {sorted.map((c) => {
        const pick = picks[c.id];
        let bg = "#1a1a28";
        if (c.resultado != null) {
          if (c.resultado === pick) bg = "#3FB68B";
          else bg = "#C4453B";
        } else {
          bg = "#262633";
        }
        return (
          <div
            key={c.id}
            className="flex-1 h-[18px] rounded-sm transition-colors duration-300"
            style={{ backgroundColor: bg }}
            title={`${c.ladoA} vs ${c.ladoB}: ${pick || "?"}`}
          />
        );
      })}
    </div>
  );
}
