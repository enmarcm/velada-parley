INSERT INTO combates (id, orden, lado_a, lado_b) VALUES
 ('c1',1,'La Parce','Fabiana Sevillano'),
 ('c2',2,'Clersss','Natalia MX'),
 ('c3',3,'Gastón Edul','Edu Aguirre'),
 ('c4',4,'Marta Díaz','Tatiana Käer'),
 ('c5',5,'Angie Velasco','Alondrissa'),
 ('c6',6,'Gero Arias','ByViruzz'),
 ('c7',7,'Lit Killah','Kidd Keo'),
 ('c8',8,'Samy Rivers','RoRo'),
 ('c9',9,'YoSoyPlex','Fernanfloo'),
 ('c10',10,'TheGrefg','IlloJuan')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parleys (id, nombre, prob, orden_display) VALUES
 ('q1','Q1',0.2790,1),
 ('q2','Q2',0.2576,2),
 ('q3','Q3',0.2576,3),
 ('q4','Q4',0.2576,4),
 ('q5','Q5',0.2475,5),
 ('q6','Q6',0.2378,6),
 ('q7','Q7',0.2378,7),
 ('q8','Q8',0.2378,8),
 ('q9','Q9',0.2284,9),
 ('q10','Q10',0.2284,10),
 ('pm1','1RO MIO',0.1192,101),
 ('pm2','2DO MIO',0.2790,102),
 ('pm3','3RO MIO',0.2283,103),
 ('pm4','4TO MIO',0.2283,104),
 ('pm5','5TO MIO',0.2107,105),
 ('pm6','6TO MIO',0.2283,106),
 ('pm7','7MO MIO',0.2283,107),
 ('pm8','8VO MIO',0.1868,108),
 ('pm9','9NO MIO',0.1528,109)
ON CONFLICT (id) DO NOTHING;

INSERT INTO parley_picks (parley_id, combate_id, pick) VALUES
-- Q1
('q1','c1','La Parce'),('q1','c2','Clersss'),('q1','c3','Gastón Edul'),
('q1','c4','Marta Díaz'),('q1','c5','Angie Velasco'),('q1','c6','Gero Arias'),
('q1','c7','Lit Killah'),('q1','c8','Samy Rivers'),('q1','c9','YoSoyPlex'),
('q1','c10','TheGrefg'),
-- Q2
('q2','c1','La Parce'),('q2','c2','Clersss'),('q2','c3','Gastón Edul'),
('q2','c4','Marta Díaz'),('q2','c5','Angie Velasco'),('q2','c6','ByViruzz'),
('q2','c7','Lit Killah'),('q2','c8','Samy Rivers'),('q2','c9','YoSoyPlex'),
('q2','c10','TheGrefg'),
-- Q3
('q3','c1','La Parce'),('q3','c2','Clersss'),('q3','c3','Gastón Edul'),
('q3','c4','Marta Díaz'),('q3','c5','Alondrissa'),('q3','c6','Gero Arias'),
('q3','c7','Lit Killah'),('q3','c8','Samy Rivers'),('q3','c9','YoSoyPlex'),
('q3','c10','TheGrefg'),
-- Q4
('q4','c1','La Parce'),('q4','c2','Clersss'),('q4','c3','Edu Aguirre'),
('q4','c4','Marta Díaz'),('q4','c5','Angie Velasco'),('q4','c6','Gero Arias'),
('q4','c7','Lit Killah'),('q4','c8','Samy Rivers'),('q4','c9','YoSoyPlex'),
('q4','c10','TheGrefg'),
-- Q5
('q5','c1','La Parce'),('q5','c2','Clersss'),('q5','c3','Gastón Edul'),
('q5','c4','Tatiana Käer'),('q5','c5','Angie Velasco'),('q5','c6','Gero Arias'),
('q5','c7','Lit Killah'),('q5','c8','Samy Rivers'),('q5','c9','YoSoyPlex'),
('q5','c10','TheGrefg'),
-- Q6
('q6','c1','La Parce'),('q6','c2','Clersss'),('q6','c3','Edu Aguirre'),
('q6','c4','Marta Díaz'),('q6','c5','Angie Velasco'),('q6','c6','ByViruzz'),
('q6','c7','Lit Killah'),('q6','c8','Samy Rivers'),('q6','c9','YoSoyPlex'),
('q6','c10','TheGrefg'),
-- Q7
('q7','c1','La Parce'),('q7','c2','Clersss'),('q7','c3','Gastón Edul'),
('q7','c4','Marta Díaz'),('q7','c5','Alondrissa'),('q7','c6','ByViruzz'),
('q7','c7','Lit Killah'),('q7','c8','Samy Rivers'),('q7','c9','YoSoyPlex'),
('q7','c10','TheGrefg'),
-- Q8
('q8','c1','La Parce'),('q8','c2','Clersss'),('q8','c3','Edu Aguirre'),
('q8','c4','Marta Díaz'),('q8','c5','Alondrissa'),('q8','c6','Gero Arias'),
('q8','c7','Lit Killah'),('q8','c8','Samy Rivers'),('q8','c9','YoSoyPlex'),
('q8','c10','TheGrefg'),
-- Q9
('q9','c1','La Parce'),('q9','c2','Clersss'),('q9','c3','Gastón Edul'),
('q9','c4','Tatiana Käer'),('q9','c5','Angie Velasco'),('q9','c6','ByViruzz'),
('q9','c7','Lit Killah'),('q9','c8','Samy Rivers'),('q9','c9','YoSoyPlex'),
('q9','c10','TheGrefg'),
-- Q10
('q10','c1','La Parce'),('q10','c2','Clersss'),('q10','c3','Gastón Edul'),
('q10','c4','Tatiana Käer'),('q10','c5','Alondrissa'),('q10','c6','Gero Arias'),
('q10','c7','Lit Killah'),('q10','c8','Samy Rivers'),('q10','c9','YoSoyPlex'),
('q10','c10','TheGrefg'),
-- 1RO MIO
('pm1','c1','La Parce'),('pm1','c2','Clersss'),('pm1','c3','Edu Aguirre'),
('pm1','c4','Marta Díaz'),('pm1','c5','Angie Velasco'),('pm1','c6','ByViruzz'),
('pm1','c7','Kidd Keo'),('pm1','c8','RoRo'),('pm1','c9','YoSoyPlex'),
('pm1','c10','TheGrefg'),
-- 2DO MIO
('pm2','c1','La Parce'),('pm2','c2','Clersss'),('pm2','c3','Gastón Edul'),
('pm2','c4','Marta Díaz'),('pm2','c5','Angie Velasco'),('pm2','c6','Gero Arias'),
('pm2','c7','Lit Killah'),('pm2','c8','Samy Rivers'),('pm2','c9','YoSoyPlex'),
('pm2','c10','TheGrefg'),
-- 3RO MIO
('pm3','c1','La Parce'),('pm3','c2','Clersss'),('pm3','c3','Gastón Edul'),
('pm3','c4','Marta Díaz'),('pm3','c5','Angie Velasco'),('pm3','c6','Gero Arias'),
('pm3','c7','Lit Killah'),('pm3','c8','Samy Rivers'),('pm3','c9','YoSoyPlex'),
('pm3','c10','IlloJuan'),
-- 4TO MIO
('pm4','c1','La Parce'),('pm4','c2','Clersss'),('pm4','c3','Gastón Edul'),
('pm4','c4','Marta Díaz'),('pm4','c5','Angie Velasco'),('pm4','c6','Gero Arias'),
('pm4','c7','Lit Killah'),('pm4','c8','RoRo'),('pm4','c9','YoSoyPlex'),
('pm4','c10','TheGrefg'),
-- 5TO MIO
('pm5','c1','La Parce'),('pm5','c2','Clersss'),('pm5','c3','Gastón Edul'),
('pm5','c4','Marta Díaz'),('pm5','c5','Angie Velasco'),('pm5','c6','ByViruzz'),
('pm5','c7','Lit Killah'),('pm5','c8','RoRo'),('pm5','c9','YoSoyPlex'),
('pm5','c10','TheGrefg'),
-- 6TO MIO
('pm6','c1','Fabiana Sevillano'),('pm6','c2','Clersss'),('pm6','c3','Gastón Edul'),
('pm6','c4','Marta Díaz'),('pm6','c5','Angie Velasco'),('pm6','c6','Gero Arias'),
('pm6','c7','Lit Killah'),('pm6','c8','Samy Rivers'),('pm6','c9','YoSoyPlex'),
('pm6','c10','TheGrefg'),
-- 7MO MIO
('pm7','c1','La Parce'),('pm7','c2','Natalia MX'),('pm7','c3','Gastón Edul'),
('pm7','c4','Marta Díaz'),('pm7','c5','Angie Velasco'),('pm7','c6','Gero Arias'),
('pm7','c7','Lit Killah'),('pm7','c8','Samy Rivers'),('pm7','c9','YoSoyPlex'),
('pm7','c10','TheGrefg'),
-- 8VO MIO
('pm8','c1','Fabiana Sevillano'),('pm8','c2','Natalia MX'),('pm8','c3','Gastón Edul'),
('pm8','c4','Marta Díaz'),('pm8','c5','Angie Velasco'),('pm8','c6','Gero Arias'),
('pm8','c7','Lit Killah'),('pm8','c8','Samy Rivers'),('pm8','c9','YoSoyPlex'),
('pm8','c10','TheGrefg'),
-- 9NO MIO
('pm9','c1','Fabiana Sevillano'),('pm9','c2','Clersss'),('pm9','c3','Gastón Edul'),
('pm9','c4','Marta Díaz'),('pm9','c5','Angie Velasco'),('pm9','c6','Gero Arias'),
('pm9','c7','Lit Killah'),('pm9','c8','RoRo'),('pm9','c9','YoSoyPlex'),
('pm9','c10','IlloJuan')
ON CONFLICT DO NOTHING;
