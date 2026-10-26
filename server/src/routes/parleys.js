import { Router } from "express";
import pool from "../db.js";
import { validarPicks } from "../validate.js";
import { estadoParley } from "../logic.js";
import { buildState } from "../shared.js";

const router = Router();

const PROB_TABLE = {
  "c1": { "La Parce": 0.55, "Fabiana Sevillano": 0.45 },
  "c2": { "Clersss": 0.55, "Natalia MX": 0.45 },
  "c3": { "Gastón Edul": 0.52, "Edu Aguirre": 0.48 },
  "c4": { "Marta Díaz": 0.53, "Tatiana Käer": 0.47 },
  "c5": { "Angie Velasco": 0.52, "Alondrissa": 0.48 },
  "c6": { "Gero Arias": 0.52, "ByViruzz": 0.48 },
  "c7": { "Lit Killah": 0.62, "Kidd Keo": 0.38 },
  "c8": { "Samy Rivers": 0.55, "RoRo": 0.45 },
  "c9": { "YoSoyPlex": 0.66, "Fernanfloo": 0.34 },
  "c10": { "TheGrefg": 0.55, "IlloJuan": 0.45 },
};

function calcProb(picks) {
  let p = 1;
  for (const [cid, pick] of Object.entries(picks)) {
    const combatProbs = PROB_TABLE[cid];
    if (combatProbs && combatProbs[pick] != null) {
      p *= combatProbs[pick];
    } else {
      return null;
    }
  }
  return Math.round(p * 10000) / 10000;
}

async function findDuplicado(picks, excludeId = null) {
  const incomingIds = Object.keys(picks).sort().join(",");
  const { rows } = await pool.query(
    "SELECT parley_id, combate_id, pick FROM parley_picks ORDER BY parley_id, combate_id"
  );
  const picksByParley = {};
  for (const p of rows) {
    if (!picksByParley[p.parley_id]) picksByParley[p.parley_id] = {};
    picksByParley[p.parley_id][p.combate_id] = p.pick;
  }
  for (const [pid, pp] of Object.entries(picksByParley)) {
    if (excludeId && pid === excludeId) continue;
    const existingIds = Object.keys(pp).sort().join(",");
    if (existingIds !== incomingIds) continue;
    let match = true;
    for (const cid of Object.keys(picks)) {
      if (pp[cid] !== picks[cid]) { match = false; break; }
    }
    if (match) {
      const { rows: pn } = await pool.query("SELECT id, nombre FROM parleys WHERE id = $1", [pid]);
      if (pn.length > 0) return { id: pn[0].id, nombre: pn[0].nombre };
    }
  }
  return null;
}

router.post("/check-duplicado", async (req, res) => {
  try {
    const { picks, excludeId } = req.body;
    if (!picks) return res.status(400).json({ error: "Falta picks" });
    const dup = await findDuplicado(picks, excludeId || null);
    res.json(dup ? { duplicado: true, parley: dup } : { duplicado: false });
  } catch (err) {
    console.error("POST check-duplicado error:", err);
    res.status(500).json({ error: "Error al comprobar duplicado" });
  }
});

router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const { nombre: rawNombre, picks, estadoApuesta } = req.body;
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

    const ea = estadoApuesta === "EN_TRIUNFOBET" ? "EN_TRIUNFOBET" : "POR_METER";
    const id = `usr_${Date.now()}`;
    const prob = calcProb(picks);

    const avisoDuplicado = await findDuplicado(picks);

    await client.query("BEGIN");
    await client.query(
      "INSERT INTO parleys (id, nombre, prob, orden_display, estado_apuesta) VALUES ($1, $2, $3, 0, $4)",
      [id, nombre, prob, ea]
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
      id, nombre, prob, picks,
      estado: calc.estado, aciertos: calc.aciertos,
      fallos: calc.fallos, pendientes: calc.pendientes,
      dependeDe, estadoApuesta: ea, avisoDuplicado,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /parleys error:", err);
    res.status(500).json({ error: "Error al crear parley" });
  } finally {
    client.release();
  }
});

router.put("/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { nombre: rawNombre, picks } = req.body;

    const { rows: exist } = await pool.query("SELECT * FROM parleys WHERE id = $1", [id]);
    if (exist.length === 0) {
      return res.status(404).json({ error: "Parley no encontrado" });
    }
    const existing = exist[0];

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
      nombre = existing.nombre;
    }

    const prob = calcProb(picks);
    const avisoDuplicado = await findDuplicado(picks, id);

    await client.query("BEGIN");
    await client.query(
      "UPDATE parleys SET nombre = $1, prob = $2 WHERE id = $3",
      [nombre, prob, id]
    );
    await client.query("DELETE FROM parley_picks WHERE parley_id = $1", [id]);
    for (const [combateId, pick] of Object.entries(picks)) {
      await client.query(
        "INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES ($1, $2, $3)",
        [id, combateId, pick]
      );
    }
    await client.query("COMMIT");

    const state = await buildState();
    res.json({ ...state, avisoDuplicado });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PUT /parleys/:id error:", err);
    res.status(500).json({ error: "Error al editar parley" });
  } finally {
    client.release();
  }
});

router.patch("/:id/estado-apuesta", async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoApuesta } = req.body;

    if (!["POR_METER", "EN_TRIUNFOBET"].includes(estadoApuesta)) {
      return res.status(400).json({ error: "Estado de apuesta no válido" });
    }

    const { rowCount } = await pool.query(
      "UPDATE parleys SET estado_apuesta = $1 WHERE id = $2",
      [estadoApuesta, id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Parley no encontrado" });
    }

    const state = await buildState();
    res.json(state);
  } catch (err) {
    console.error("PATCH /parleys/:id/estado-apuesta error:", err);
    res.status(500).json({ error: "Error al actualizar estado de apuesta" });
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
