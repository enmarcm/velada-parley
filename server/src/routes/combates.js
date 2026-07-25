import { Router } from "express";
import pool from "../db.js";
import { validarResultado } from "../validate.js";
import { estadoParley, resumenParleys, combatesResueltosCount } from "../logic.js";

const router = Router();

async function computeState() {
  const { rows: combates } = await pool.query(
    "SELECT id, orden, lado_a, lado_b, resultado FROM combates ORDER BY orden"
  );
  const { rows: parleysRows } = await pool.query(
    "SELECT id, nombre, prob, orden_display FROM parleys ORDER BY orden_display"
  );
  const { rows: picksRows } = await pool.query(
    "SELECT parley_id, combate_id, pick FROM parley_picks"
  );
  const picksByParley = {};
  for (const p of picksRows) {
    if (!picksByParley[p.parley_id]) picksByParley[p.parley_id] = {};
    picksByParley[p.parley_id][p.combate_id] = p.pick;
  }
  const parleys = parleysRows.map((p) => {
    const picks = picksByParley[p.id] || {};
    const calc = estadoParley({ picks }, combates);
    let dependeDe = null;
    if (calc.dependeDe) {
      const cd = calc.dependeDe;
      dependeDe = { id: cd.id, orden: cd.orden, nombre: `${cd.lado_a} vs ${cd.lado_b}` };
    }
    return {
      id: p.id, nombre: p.nombre, prob: p.prob ? parseFloat(p.prob) : null,
      picks, estado: calc.estado, aciertos: calc.aciertos,
      fallos: calc.fallos, pendientes: calc.pendientes, dependeDe,
    };
  });
  const ordenEstado = { VIVO: 0, GANADO: 1, DESCARTADO: 2 };
  parleys.sort((a, b) => {
    const ea = ordenEstado[a.estado], eb = ordenEstado[b.estado];
    if (ea !== eb) return ea - eb;
    if (a.estado === "VIVO") return b.aciertos - a.aciertos || a.orden_display - b.orden_display;
    return a.orden_display - b.orden_display;
  });
  const resumen = resumenParleys(parleys);
  resumen.combatesResueltos = combatesResueltosCount(combates);
  return {
    combates: combates.map((c) => ({ id: c.id, orden: c.orden, ladoA: c.lado_a, ladoB: c.lado_b, resultado: c.resultado })),
    parleys, resumen,
  };
}

router.put("/:id/resultado", async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado } = req.body;

    const { rows: combateRows } = await pool.query(
      "SELECT * FROM combates WHERE id = $1", [id]
    );
    if (combateRows.length === 0) {
      return res.status(404).json({ error: "Combate no encontrado" });
    }
    const combate = combateRows[0];

    if (!validarResultado(combate, resultado)) {
      return res.status(400).json({ error: "Resultado no válido para este combate" });
    }

    const oldState = await computeState();
    const oldCounts = { vivos: oldState.resumen.vivos, descartados: oldState.resumen.descartados, ganados: oldState.resumen.ganados };

    await pool.query(
      "UPDATE combates SET resultado = $1, updated_at = now() WHERE id = $2",
      [resultado, id]
    );

    const newState = await computeState();
    const impacto = {
      descartadosNuevos: newState.resumen.descartados - oldCounts.descartados,
      ganadosNuevos: newState.resumen.ganados - oldCounts.ganados,
      vivosRestantes: newState.resumen.vivos,
    };

    res.json({ ...newState, impacto });
  } catch (err) {
    console.error("PUT /combates/:id/resultado error:", err);
    res.status(500).json({ error: "Error al actualizar resultado" });
  }
});

export default router;
