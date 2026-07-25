import { useState, useEffect, useCallback } from "react";
import { getState, getCachedState, setResultado, resetNoche, flushQueue } from "./api.js";
import { estadoParley, resumenParleys, combatesResueltosCount } from "./logic.js";
import Marcador from "./components/Marcador.jsx";
import CombateActual from "./components/CombateActual.jsx";
import ListaResueltos from "./components/ListaResueltos.jsx";
import EnVivo from "./components/EnVivo.jsx";
import ParleysView from "./components/ParleysView.jsx";
import TabBar from "./components/TabBar.jsx";
import Toast from "./components/Toast.jsx";

export default function App() {
  const [state, setState] = useState(() => getCachedState());
  const [tab, setTab] = useState("envivo");
  const [toast, setToast] = useState(null);
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(!state);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const data = await getState();
      setState(data);
      setConnected(true);
      return data;
    } catch (e) {
      setConnected(false);
      const cached = getCachedState();
      if (cached) setState(cached);
      return cached;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(() => {
      if (navigator.onLine) {
        flushQueue().then(() => fetchState());
      }
    }, 10000);
    const onOnline = () => { flushQueue().then(fetchState); };
    window.addEventListener("online", onOnline);
    return () => {
      clearInterval(interval);
      window.removeEventListener("online", onOnline);
    };
  }, [fetchState]);

  const handleSetResultado = async (combateId, resultado) => {
    const prevState = state;
    try {
      const newState = await setResultado(combateId, resultado);
      setState(newState);
      if (newState.impacto) {
        const { descartadosNuevos, ganadosNuevos, vivosRestantes } = newState.impacto;
        if (descartadosNuevos > 0 && ganadosNuevos > 0) {
          showToast(`−${descartadosNuevos} parleys · ¡${ganadosNuevos} ganado${ganadosNuevos > 1 ? "s" : ""}!`, "info");
        } else if (descartadosNuevos > 0) {
          showToast(`−${descartadosNuevos} parley${descartadosNuevos > 1 ? "s" : ""} descartado${descartadosNuevos > 1 ? "s" : ""}`, "error");
        } else if (ganadosNuevos > 0) {
          showToast(`¡${ganadosNuevos} parley${ganadosNuevos > 1 ? "s" : ""} ganado${ganadosNuevos > 1 ? "s" : ""}!`, "success");
        } else {
          showToast("Todos siguen vivos", "success");
        }
      }
    } catch (e) {
      const optimistic = applyOptimistic(prevState, combateId, resultado);
      if (optimistic) setState(optimistic);
      showToast("Sin conexión — se guardará al reconectar", "warn");
    }
  };

  const applyOptimistic = (prev, combateId, resultado) => {
    if (!prev) return null;
    const combates = prev.combates.map((c) =>
      c.id === combateId ? { ...c, resultado } : c
    );
    const parleys = prev.parleys.map((p) => {
      const calc = estadoParley(p.picks, combates);
      let dependeDe = null;
      if (calc.dependeDe) {
        const cd = calc.dependeDe;
        dependeDe = { id: cd.id, orden: cd.orden, nombre: `${cd.ladoA} vs ${cd.ladoB}` };
      }
      return { ...p, ...calc, dependeDe };
    });
    const resumen = resumenParleys(parleys);
    resumen.combatesResueltos = combatesResueltosCount(combates);
    return { combates, parleys, resumen };
  };

  const handleReset = async () => {
    try {
      const data = await resetNoche();
      setState(data);
      showToast("Noche reiniciada", "success");
    } catch (e) {
      showToast("Error al reiniciar", "error");
    }
  };

  const refreshState = () => fetchState();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fondo">
        <div className="animate-pulse text-vivo font-display text-2xl">PARLEYS</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fondo text-texto font-body pb-20 max-w-[480px] mx-auto relative">
      {!connected && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-descartado/90 text-white text-center text-xs py-1 font-medium">
          Sin conexión con el servidor. Mostrando lo último guardado.
        </div>
      )}

      {tab === "envivo" && state && (
        <EnVivo
          state={state}
          onSetResultado={handleSetResultado}
          onReset={handleReset}
          showToast={showToast}
          refreshState={refreshState}
        />
      )}

      {tab === "parleys" && state && (
        <ParleysView
          state={state}
          onRefresh={refreshState}
          showToast={showToast}
        />
      )}

      <TabBar active={tab} onChange={setTab} />

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
