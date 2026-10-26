import { useEffect, useState } from "react";

const colors = {
  info: "bg-acentoFrio/90",
  error: "bg-descartado/90",
  success: "bg-ganado/90",
  warn: "bg-vivo/90",
};

export default function Toast({ msg, type = "info", onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (exiting) {
      const t = setTimeout(() => onDone?.(), 160);
      return () => clearTimeout(t);
    }
  }, [exiting, onDone]);

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-[480px] mx-auto">
      <div className={`${colors[type] || colors.info} text-white text-center text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg ${
        exiting ? "animate-toastOut" : "animate-toastIn"
      }`}>
        {msg}
      </div>
    </div>
  );
}
