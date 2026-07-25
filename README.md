# Velada Parley Tracker

Seguimiento EN VIVO de parleys para La Velada del Año 6.

## Stack

- **Server**: Node.js + Express + PostgreSQL (node-postgres)
- **Client**: React 18 + Vite 5 + Tailwind CSS 3 + PWA
- **Deploy**: PM2 + nginx + Let's Encrypt

## Desarrollo local

```bash
cd server
cp .env.example .env  # editar DATABASE_URL
npm ci
npm run migrate && npm run seed
npm run dev            # http://localhost:8080
```

```bash
cd client
cp .env.example .env  # VITE_APP_TOKEN igual que APP_TOKEN
VITE_API_BASE=http://localhost:8080 npm run dev  # http://localhost:5173
```

## Despliegue

Ver `deploy/DEPLOY.md`.

## Seguridad del token

El `APP_TOKEN` se compara en el servidor en cada petición. El cliente lo envía vía `Authorization: Bearer`. Como el token queda embebido en el bundle JS del frontend, alguien que inspeccione el código podría verlo. Esto solo protege contra bots o curiosos casuales. Para seguridad adicional, añade HTTP Basic Auth en nginx (ver DEPLOY.md).

## Créditos

Diseño con [UI-UX-Pro-Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).
