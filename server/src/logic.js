export function estadoParley(parley, combates) {
  let aciertos = 0, fallos = 0, pendientes = 0;
  let dependeDe = null;
  const porOrden = [...combates].sort((a, b) => a.orden - b.orden);
  for (const c of porOrden) {
    const pick = parley.picks[c.id];
    if (c.resultado == null) {
      pendientes++;
      if (dependeDe == null) dependeDe = c;
    } else if (c.resultado === pick) {
      aciertos++;
    } else {
      fallos++;
    }
  }
  let estado;
  if (fallos > 0) estado = "DESCARTADO";
  else if (pendientes === 0) estado = "GANADO";
  else estado = "VIVO";
  return {
    estado,
    aciertos,
    fallos,
    pendientes,
    dependeDe: estado === "VIVO" ? dependeDe : null,
  };
}

export function resumenParleys(parleysCalculados) {
  let vivos = 0, descartados = 0, ganados = 0;
  for (const p of parleysCalculados) {
    if (p.estado === "VIVO") vivos++;
    else if (p.estado === "DESCARTADO") descartados++;
    else if (p.estado === "GANADO") ganados++;
  }
  return { total: parleysCalculados.length, vivos, descartados, ganados };
}

export function combatesResueltosCount(combates) {
  return combates.filter((c) => c.resultado != null).length;
}
