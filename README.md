# 🥊 Velada Parley Tracker

> Seguimiento **en vivo** de parleys (apuestas combinadas entre amigos) durante *La Velada del Año 6*. Cada combate actualiza en tiempo real el estado de todos los parleys.

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-000?style=flat-square&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![nginx](https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white)


<!-- TODO: captura o GIF -->
![Velada Parley Tracker](docs/screenshot.png)

## ✨ Funcionalidades

<!-- TODO: completar con las funciones reales de la app -->
- Estado en vivo de cada parley a medida que se resuelven los combates.
- PWA instalable, pensada para el móvil durante el evento.
- API protegida por token (`Authorization: Bearer`).

## 🛠️ Stack

- **Server:** Node.js, Express, PostgreSQL (node-postgres)
- **Client:** React 18, Vite 5, Tailwind CSS 3, PWA
- **Deploy:** PM2, nginx, Let's Encrypt

## 🚀 Desarrollo local

```bash
# API
cd server
cp .env.example .env        # DATABASE_URL, APP_TOKEN
npm ci && npm run migrate && npm run seed
npm run dev                 # http://localhost:8080

# Client
cd client
cp .env.example .env        # VITE_APP_TOKEN = APP_TOKEN
VITE_API_BASE=http://localhost:8080 npm run dev   # http://localhost:5173
```

Despliegue: ver [`deploy/DEPLOY.md`](deploy/DEPLOY.md).

## 🔐 Nota de seguridad

El token va embebido en el bundle del cliente. Sólo frena a bots y curiosos. Para más protección, añade HTTP Basic Auth en nginx (ver DEPLOY.md).

## Créditos

Hecho por [Enmanuel Colina](https://enmarcm.site). Diseño con [UI-UX-Pro-Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

---

🇬🇧 *Live parlay tracker built for "La Velada del Año 6". React + Vite + Tailwind PWA, Express + PostgreSQL API, deployed with PM2, nginx and Let's Encrypt.*
