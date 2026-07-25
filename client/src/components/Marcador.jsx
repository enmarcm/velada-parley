export default function Marcador({ resumen }) {
  return (
    <div className="sticky top-0 z-40 bg-fondo/95 backdrop-blur-sm border-b border-borde/50 pt-3 pb-4 px-4">
      <div className="flex justify-center items-center gap-8 mb-1">
        <div className="text-center">
          <div className="font-display text-5xl text-vivo tabular-nums leading-none transition-all duration-300">
            {resumen.vivos}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-vivo/70 font-semibold mt-1">
            Vivos
          </div>
        </div>
        {resumen.ganados > 0 && (
          <div className="text-center">
            <div className="font-display text-5xl text-ganado tabular-nums leading-none transition-all duration-300">
              {resumen.ganados}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-ganado/70 font-semibold mt-1">
              Ganados
            </div>
          </div>
        )}
        <div className="text-center">
          <div className="font-display text-5xl text-descartado tabular-nums leading-none transition-all duration-300">
            {resumen.descartados}
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
