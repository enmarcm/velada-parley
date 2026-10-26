import "dotenv/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function seed() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sql = readFileSync(join(__dirname, "..", "db", "seed_lote3.sql"), "utf8");
    await pool.query(sql);
    console.log("Seed lote 3 completado: 5 nuevos parleys insertados/idempotente.");
  } catch (err) {
    console.error("Error en seed lote 3:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
