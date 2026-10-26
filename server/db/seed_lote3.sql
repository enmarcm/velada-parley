-- n1
INSERT INTO parleys (id, nombre, prob, orden_display, estado_apuesta)
VALUES ('n1', 'OPCIÓN 1 - Favoritos mercado', 0.5587, 201, 'EN_TRIUNFOBET')
ON CONFLICT (id) DO NOTHING;
INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES
  ('n1','c1','Fabiana Sevillano'),('n1','c2','Natalia MX'),('n1','c3','Edu Aguirre'),
  ('n1','c4','Marta Díaz'),('n1','c5','Gero Arias'),('n1','c6','Angie Velasco'),
  ('n1','c7','Lit Killah'),('n1','c8','RoRo'),('n1','c9','YoSoyPlex'),
  ('n1','c10','TheGrefg')
ON CONFLICT (parley_id, combate_id) DO NOTHING;

-- n2
INSERT INTO parleys (id, nombre, prob, orden_display, estado_apuesta)
VALUES ('n2', 'OPCIÓN 2 - Alondrissa', 0.5157, 202, 'EN_TRIUNFOBET')
ON CONFLICT (id) DO NOTHING;
INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES
  ('n2','c1','Fabiana Sevillano'),('n2','c2','Natalia MX'),('n2','c3','Edu Aguirre'),
  ('n2','c4','Marta Díaz'),('n2','c5','Gero Arias'),('n2','c6','Alondrissa'),
  ('n2','c7','Lit Killah'),('n2','c8','RoRo'),('n2','c9','YoSoyPlex'),
  ('n2','c10','TheGrefg')
ON CONFLICT (parley_id, combate_id) DO NOTHING;

-- n3 (SIN c1)
INSERT INTO parleys (id, nombre, prob, orden_display, estado_apuesta)
VALUES ('n3', 'OPCIÓN 3 - Tatiana', 0.9008, 203, 'EN_TRIUNFOBET')
ON CONFLICT (id) DO NOTHING;
INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES
  ('n3','c2','Natalia MX'),('n3','c3','Edu Aguirre'),('n3','c4','Tatiana Käer'),
  ('n3','c5','Gero Arias'),('n3','c6','Angie Velasco'),('n3','c7','Lit Killah'),
  ('n3','c8','RoRo'),('n3','c9','YoSoyPlex'),('n3','c10','TheGrefg')
ON CONFLICT (parley_id, combate_id) DO NOTHING;

-- n4 (SIN c1)
INSERT INTO parleys (id, nombre, prob, orden_display, estado_apuesta)
VALUES ('n4', 'OPCIÓN 4 - Gastón Edul', 0.8311, 204, 'EN_TRIUNFOBET')
ON CONFLICT (id) DO NOTHING;
INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES
  ('n4','c2','Natalia MX'),('n4','c3','Gastón Edul'),('n4','c4','Marta Díaz'),
  ('n4','c5','Gero Arias'),('n4','c6','Angie Velasco'),('n4','c7','Lit Killah'),
  ('n4','c8','RoRo'),('n4','c9','YoSoyPlex'),('n4','c10','TheGrefg')
ON CONFLICT (parley_id, combate_id) DO NOTHING;

-- n5 (SIN c1 ni c2)
INSERT INTO parleys (id, nombre, prob, orden_display, estado_apuesta)
VALUES ('n5', 'SIN APERTURA', 1.7029, 205, 'EN_TRIUNFOBET')
ON CONFLICT (id) DO NOTHING;
INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES
  ('n5','c3','Edu Aguirre'),('n5','c4','Marta Díaz'),('n5','c5','ByViruzz'),
  ('n5','c6','Angie Velasco'),('n5','c7','Lit Killah'),('n5','c8','RoRo'),
  ('n5','c9','YoSoyPlex'),('n5','c10','TheGrefg')
ON CONFLICT (parley_id, combate_id) DO NOTHING;
