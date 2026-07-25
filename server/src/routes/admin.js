import { Router } from "express";
import pool from "../db.js";
import { estadoParley } from "../logic.js";

const router = Router();

router.post("/reset", async (req, res) => {
  try {
    await pool.query("UPDATE combates SET resultado = NULL, updated_at = now()");
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
    res.json({ parleys, combates: combates.map((c) => ({ id: c.id, orden: c.orden, ladoA: c.lado_a, ladoB: c.lado_b, resultado: c.resultado })) });
  } catch (err) {
    console.error("POST /reset error:", err);
    res.status(500).json({ error: "Error al reiniciar" });
  }
});

export default router;
