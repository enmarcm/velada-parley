import { Router } from "express";
import { buildState } from "../shared.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const state = await buildState();
    res.json(state);
  } catch (err) {
    console.error("GET /state error:", err);
    res.status(500).json({ error: "Error al obtener estado" });
  }
});

export default router;
