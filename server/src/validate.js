export function validarResultado(combate, resultado) {
  if (resultado === null || resultado === "EMPATE") return true;
  if (resultado === combate.lado_a || resultado === combate.lado_b) return true;
  return false;
}

export function validarPicks(combates, picks) {
  const pickCount = Object.keys(picks).length;
  if (pickCount < 2) {
    return { valido: false, error: "Un parley necesita al menos 2 combates" };
  }
  if (pickCount > 10) {
    return { valido: false, error: "Un parley no puede tener más de 10 combates" };
  }
  for (const c of combates) {
    const pick = picks[c.id];
    if (pick == null) continue;
    if (pick !== c.lado_a && pick !== c.lado_b) {
      return { valido: false, error: `Pick "${pick}" no válido para ${c.lado_a} vs ${c.lado_b}` };
    }
  }
  return { valido: true };
}
