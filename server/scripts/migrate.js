import "dotenv/config";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const schema = readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8");
    await pool.query(schema);
    console.log("Schema base aplicado.");

    const migrationsDir = join(__dirname, "..", "db", "migrations");
    let migrations;
    try {
      migrations = readdirSync(migrationsDir).sort();
    } catch {
      migrations = [];
    }

    for (const file of migrations) {
      if (!file.endsWith(".sql")) continue;
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      await pool.query(sql);
      console.log(`Migración aplicada: ${file}`);
    }

    console.log("Migración completada.");
  } catch (err) {
    console.error("Error en migración:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
