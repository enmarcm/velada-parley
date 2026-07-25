ALTER TABLE parleys
  ADD COLUMN IF NOT EXISTS estado_apuesta TEXT NOT NULL DEFAULT 'POR_METER';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_estado_apuesta'
  ) THEN
    ALTER TABLE parleys
      ADD CONSTRAINT chk_estado_apuesta
      CHECK (estado_apuesta IN ('POR_METER','EN_TRIUNFOBET'));
  END IF;
END $$;
