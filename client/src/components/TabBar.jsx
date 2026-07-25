import { Swords, ScrollText } from "lucide-react";

const tabs = [
  { id: "envivo", label: "EN VIVO", icon: Swords },
  { id: "parleys", label: "PARLEYS", icon: ScrollText },
];

export default function TabBar({ active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-fondo/95 backdrop-blur-md border-t border-borde/50">
      <div className="max-w-[480px] mx-auto flex">
        {tabs.map((t) => {
          const isActive = active === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                isActive ? "text-vivo" : "text-textoSec hover:text-texto"
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] uppercase tracking-widest font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
