export function validarResultado(combate, resultado) {
  if (resultado === null || resultado === "EMPATE") return true;
  if (resultado === combate.lado_a || resultado === combate.lado_b) return true;
  return false;
}

export function validarPicks(combates, picks) {
  for (const c of combates) {
    const pick = picks[c.id];
    if (!pick) return { valido: false, error: `Falta pick para ${c.lado_a} vs ${c.lado_b}` };
    if (pick !== c.lado_a && pick !== c.lado_b) {
      return { valido: false, error: `Pick "${pick}" no válido para ${c.lado_a} vs ${c.lado_b}` };
    }
  }
  return { valido: true };
}
