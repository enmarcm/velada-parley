import { Router } from "express";
import pool from "../db.js";
import { validarPicks } from "../validate.js";
import { estadoParley } from "../logic.js";

const router = Router();

async function buildState() {
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
  return { parleys, combates: combates.map((c) => ({ id: c.id, orden: c.orden, ladoA: c.lado_a, ladoB: c.lado_b, resultado: c.resultado })) };
}

router.post("/check-duplicado", async (req, res) => {
  try {
    const { picks } = req.body;
    if (!picks) return res.status(400).json({ error: "Falta picks" });

    const { rows } = await pool.query(
      "SELECT parley_id, combate_id, pick FROM parley_picks ORDER BY parley_id, combate_id"
    );

    const picksByParley = {};
    for (const p of rows) {
      if (!picksByParley[p.parley_id]) picksByParley[p.parley_id] = {};
      picksByParley[p.parley_id][p.combate_id] = p.pick;
    }

    for (const [parleyId, parleyPicks] of Object.entries(picksByParley)) {
      let match = true;
      for (const cid of Object.keys(picks)) {
        if (parleyPicks[cid] !== picks[cid]) { match = false; break; }
      }
      if (match && Object.keys(parleyPicks).length === Object.keys(picks).length) {
        const { rows: pRows } = await pool.query(
          "SELECT id, nombre FROM parleys WHERE id = $1", [parleyId]
        );
        if (pRows.length > 0) {
          return res.json({ duplicado: true, parley: { id: pRows[0].id, nombre: pRows[0].nombre } });
        }
      }
    }
    res.json({ duplicado: false });
  } catch (err) {
    console.error("POST check-duplicado error:", err);
    res.status(500).json({ error: "Error al comprobar duplicado" });
  }
});

router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const { nombre: rawNombre, picks } = req.body;

    if (!picks) return res.status(400).json({ error: "Falta picks" });

    const { rows: combates } = await pool.query(
      "SELECT id, lado_a, lado_b FROM combates ORDER BY orden"
    );
    const validation = validarPicks(combates, picks);
    if (!validation.valido) {
      return res.status(400).json({ error: validation.error });
    }

    let nombre = rawNombre;
    if (!nombre || nombre.trim() === "") {
      const { rows: countRows } = await pool.query("SELECT COUNT(*) as cnt FROM parleys");
      nombre = `MI PARLEY #${parseInt(countRows[0].cnt) + 1}`;
    }

    const id = `usr_${Date.now()}`;

    let avisoDuplicado = null;
    const { rows: existingPicks } = await pool.query(
      "SELECT parley_id, combate_id, pick FROM parley_picks ORDER BY parley_id, combate_id"
    );
    const picksByParley = {};
    for (const p of existingPicks) {
      if (!picksByParley[p.parley_id]) picksByParley[p.parley_id] = {};
      picksByParley[p.parley_id][p.combate_id] = p.pick;
    }
    for (const [pid, pp] of Object.entries(picksByParley)) {
      let match = true;
      for (const cid of Object.keys(picks)) {
        if (pp[cid] !== picks[cid]) { match = false; break; }
      }
      if (match && Object.keys(pp).length === Object.keys(picks).length) {
        const { rows: pn } = await pool.query("SELECT id, nombre FROM parleys WHERE id = $1", [pid]);
        if (pn.length > 0) avisoDuplicado = { id: pn[0].id, nombre: pn[0].nombre };
        break;
      }
    }

    await client.query("BEGIN");

    await client.query(
      "INSERT INTO parleys (id, nombre, prob, orden_display) VALUES ($1, $2, NULL, 0)",
      [id, nombre]
    );

    for (const [combateId, pick] of Object.entries(picks)) {
      await client.query(
        "INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES ($1, $2, $3)",
        [id, combateId, pick]
      );
    }

    await client.query("COMMIT");

    const calc = estadoParley({ picks }, combates);
    let dependeDe = null;
    if (calc.dependeDe) {
      const cd = calc.dependeDe;
      dependeDe = { id: cd.id, orden: cd.orden, nombre: `${cd.lado_a} vs ${cd.lado_b}` };
    }

    res.status(201).json({
      id, nombre, prob: null, picks,
      estado: calc.estado, aciertos: calc.aciertos,
      fallos: calc.fallos, pendientes: calc.pendientes,
      dependeDe, avisoDuplicado,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /parleys error:", err);
    res.status(500).json({ error: "Error al crear parley" });
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM parleys WHERE id = $1", [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: "Parley no encontrado" });
    }
    const state = await buildState();
    res.json(state);
  } catch (err) {
    console.error("DELETE /parleys/:id error:", err);
    res.status(500).json({ error: "Error al borrar parley" });
  }
});

export default router;
