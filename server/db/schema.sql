CREATE TABLE IF NOT EXISTS combates (
  id         TEXT PRIMARY KEY,
  orden      INTEGER NOT NULL UNIQUE,
  lado_a     TEXT NOT NULL,
  lado_b     TEXT NOT NULL,
  resultado  TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parleys (
  id            TEXT PRIMARY KEY,
  nombre        TEXT NOT NULL,
  prob          NUMERIC(6,4),
  orden_display INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parley_picks (
  parley_id  TEXT NOT NULL REFERENCES parleys(id) ON DELETE CASCADE,
  combate_id TEXT NOT NULL REFERENCES combates(id) ON DELETE CASCADE,
  pick       TEXT NOT NULL,
  PRIMARY KEY (parley_id, combate_id)
);

CREATE INDEX IF NOT EXISTS idx_picks_parley ON parley_picks(parley_id);
