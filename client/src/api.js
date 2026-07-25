const BASE = import.meta.env.VITE_API_BASE || "";
const TOKEN = import.meta.env.VITE_APP_TOKEN || "";

function headers() {
  return {
    "Content-Type": "application/json",
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  };
}

let cachedState = null;

function loadCache() {
  try {
    const raw = localStorage.getItem("velada6_cache");
    if (raw) cachedState = JSON.parse(raw);
  } catch {}
  return cachedState;
}

function saveCache(state) {
  try {
    localStorage.setItem("velada6_cache", JSON.stringify(state));
    cachedState = state;
  } catch {}
}

let pendingQueue = [];

function loadQueue() {
  try {
    const raw = localStorage.getItem("velada6_cola");
    if (raw) pendingQueue = JSON.parse(raw);
  } catch {}
}

function saveQueue() {
  try {
    localStorage.setItem("velada6_cola", JSON.stringify(pendingQueue));
  } catch {}
}

loadCache();
loadQueue();

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }
  return res.json();
}

export async function getState() {
  const data = await apiFetch("/api/state");
  saveCache(data);
  return data;
}

export function getCachedState() {
  return cachedState;
}

export async function setResultado(combateId, resultado) {
  const data = await apiFetch(`/api/combates/${combateId}/resultado`, {
    method: "PUT",
    body: JSON.stringify({ resultado }),
  });
  saveCache(data);
  return data;
}

export async function checkDuplicado(picks, excludeId) {
  return apiFetch("/api/parleys/check-duplicado", {
    method: "POST",
    body: JSON.stringify({ picks, excludeId }),
  });
}

export async function crearParley(nombre, picks) {
  const data = await apiFetch("/api/parleys", {
    method: "POST",
    body: JSON.stringify({ nombre, picks }),
  });
  return data;
}

export async function editarParley(id, nombre, picks) {
  const data = await apiFetch(`/api/parleys/${id}`, {
    method: "PUT",
    body: JSON.stringify({ nombre, picks }),
  });
  saveCache(data);
  return data;
}

export async function actualizarEstadoApuesta(id, estadoApuesta) {
  const data = await apiFetch(`/api/parleys/${id}/estado-apuesta`, {
    method: "PATCH",
    body: JSON.stringify({ estadoApuesta }),
  });
  saveCache(data);
  return data;
}

export async function borrarParley(id) {
  const data = await apiFetch(`/api/parleys/${id}`, { method: "DELETE" });
  saveCache(data);
  return data;
}

export async function resetNoche() {
  const data = await apiFetch("/api/reset", { method: "POST" });
  saveCache(data);
  return data;
}

export function enqueuePending(action) {
  pendingQueue.push({ ...action, ts: Date.now() });
  saveQueue();
  return pendingQueue.length;
}

export function getPendingQueue() {
  return pendingQueue;
}

export function clearQueue() {
  pendingQueue = [];
  saveQueue();
}

export async function flushQueue() {
  if (pendingQueue.length === 0) return;
  const q = [...pendingQueue];
  clearQueue();
  for (const item of q) {
    try {
      if (item.type === "resultado") {
        await setResultado(item.combateId, item.resultado);
      } else if (item.type === "crear") {
        await crearParley(item.nombre, item.picks);
      } else if (item.type === "editar") {
        await editarParley(item.id, item.nombre, item.picks);
      } else if (item.type === "estado-apuesta") {
        await actualizarEstadoApuesta(item.id, item.estadoApuesta);
      } else if (item.type === "borrar") {
        await borrarParley(item.id);
      } else if (item.type === "reset") {
        await resetNoche();
      }
    } catch (e) {
      pendingQueue.push(item);
      saveQueue();
      break;
    }
  }
}
