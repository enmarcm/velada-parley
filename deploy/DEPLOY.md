# Despliegue — Velada Parley Tracker

## Requisitos en el VPS

```bash
node -v          # ≥20 LTS
psql --version   # PostgreSQL en marcha
nginx -v         # nginx instalado
pm2 --version    # npm i -g pm2
certbot --version # certbot instalado
```

## 1. Base de datos

Conéctate como superusuario postgres:

```sql
CREATE DATABASE velada_parley;
CREATE USER velada_user WITH ENCRYPTED PASSWORD 'CAMBIA_ESTA_CLAVE';
GRANT ALL PRIVILEGES ON DATABASE velada_parley TO velada_user;
\c velada_parley
GRANT ALL ON SCHEMA public TO velada_user;
```

## 2. Clonar y configurar

```bash
git clone <repo-url> velada-parley
cd velada-parley
```

### Backend

```bash
cd server
cp .env.example .env
# Editar .env: DATABASE_URL, APP_TOKEN, CORS_ORIGIN
npm ci
npm run migrate
npm run seed
pm2 start ecosystem.config.js
pm2 save
```

### Frontend

```bash
cd client
cp .env.example .env
# Editar .env: VITE_APP_TOKEN (mismo que APP_TOKEN del server)
npm ci
npm run build
```

## 3. nginx

```bash
# Desactivar sitio anterior si existe
sudo rm -f /etc/nginx/sites-enabled/parleys.old  # ajustar nombre

# Copiar configuración
sudo cp deploy/nginx-parleys.conf /etc/nginx/sites-available/parleys
sudo ln -sf /etc/nginx/sites-available/parleys /etc/nginx/sites-enabled/parleys

# Publicar estáticos
sudo mkdir -p /var/www/velada-parley
sudo rsync -a client/dist/ /var/www/velada-parley/client/dist/

# Verificar y recargar
sudo nginx -t && sudo systemctl reload nginx
```

> Si tu nginx usa `conf.d` en vez de `sites-available/enabled`, copia el archivo directamente a `/etc/nginx/conf.d/parleys.conf`.

## 4. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d parleys.enmarcm-vps.site
```

certbot modificará `nginx-parleys.conf` para servir HTTPS y redirigir HTTP.

## 5. Verificar

- `https://parleys.enmarcm-vps.site` — carga la app
- `https://parleys.enmarcm-vps.site/api/health` — responde `{ "ok": true }`
- `https://parleys.enmarcm-vps.site/api/state` — requiere token, devuelve JSON

## 6. Actualizaciones

```bash
git pull
cd server && npm ci && pm2 restart velada-parley-api
cd client && npm ci && npm run build
sudo rsync -a client/dist/ /var/www/velada-parley/client/dist/
```

## 7. Seguridad extra (HTTP Basic Auth)

Para añadir una capa adicional además del token, descomenta las líneas `auth_basic` en `nginx-parleys.conf` y crea el archivo de contraseñas:

```bash
sudo htpasswd -c /etc/nginx/.htpasswd-velada enmanuel
```

Luego recarga nginx.
