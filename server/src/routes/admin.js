import { Router } from "express";
import pool from "../db.js";
import { buildState } from "../shared.js";

const router = Router();

router.post("/reset", async (req, res) => {
  try {
    await pool.query("UPDATE combates SET resultado = NULL, updated_at = now()");
    const state = await buildState();
    res.json(state);
  } catch (err) {
    console.error("POST /reset error:", err);
    res.status(500).json({ error: "Error al reiniciar" });
  }
});

export default router;
