import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./auth.js";
import stateRouter from "./routes/state.js";
import combatesRouter from "./routes/combates.js";
import parleysRouter from "./routes/parleys.js";
import adminRouter from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/api/state", auth, stateRouter);
app.use("/api/combates", auth, combatesRouter);
app.use("/api/parleys", auth, parleysRouter);
app.use("/api/reset", auth, adminRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Velada Parley API escuchando en puerto ${PORT}`);
});
