import { Router } from "express";
import pool from "../db.js";
import { validarResultado } from "../validate.js";
import { buildState } from "../shared.js";

const router = Router();

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

    const oldState = await buildState();
    const oldCounts = {
      vivos: oldState.resumen.vivos,
      descartados: oldState.resumen.descartados,
      ganados: oldState.resumen.ganados,
    };

    await pool.query(
      "UPDATE combates SET resultado = $1, updated_at = now() WHERE id = $2",
      [resultado, id]
    );

    const newState = await buildState();
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
