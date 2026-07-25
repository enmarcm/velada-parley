import "dotenv/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const sql = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");
    await pool.query(sql);
    console.log("Migración completada: tablas creadas/verificadas.");
  } catch (err) {
    console.error("Error en migración:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
