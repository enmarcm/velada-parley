// Genera iconos PWA desde SVG usando canvas (node-canvas)
// Ejecutar: node scripts/gen-icons.js
// Requiere: npm install canvas

import { createCanvas, registerFont } from "canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const VIVO = "#F5A623";
const FONDO = "#0B0B0F";

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = FONDO;
  ctx.fillRect(0, 0, size, size);

  // Borde redondeado
  const r = size * 0.15;
  ctx.strokeStyle = VIVO;
  ctx.lineWidth = Math.max(2, size * 0.03);
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.stroke();

  // Texto V6
  const fs = size * 0.4;
  ctx.fillStyle = VIVO;
  ctx.font = `bold ${fs}px Helvetica`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("V6", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

function generateMaskable(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = FONDO;
  ctx.fillRect(0, 0, size, size);

  const fs = size * 0.35;
  ctx.fillStyle = VIVO;
  ctx.font = `bold ${fs}px Helvetica`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("V6", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

try {
  writeFileSync(join(PUBLIC, "icon-192.png"), generateIcon(192));
  writeFileSync(join(PUBLIC, "icon-512.png"), generateIcon(512));
  writeFileSync(join(PUBLIC, "icon-512-maskable.png"), generateMaskable(512));
  writeFileSync(join(PUBLIC, "apple-touch-icon.png"), generateIcon(180));
  console.log("Iconos PWA generados en public/");
} catch (e) {
  console.error("Error generando iconos:", e.message);
  console.log("Crea los PNG manualmente o usa gen-icons.sh (requiere ImageMagick)");
}
