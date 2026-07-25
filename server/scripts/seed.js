import "dotenv/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sql = readFileSync(join(__dirname, "..", "db", "seed.sql"), "utf8");
    await pool.query(sql);
    console.log("Seed completado: combates y parleys insertados/idempotente.");
  } catch (err) {
    console.error("Error en seed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
