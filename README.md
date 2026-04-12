# MR.BULL 🐂

Menú digital para MR.BULL — Mexican food, sandwich and hot dog.

## Stack

- **Next.js 16** (App Router)
- **MongoDB** (Mongoose)
- **AWS S3** (imágenes)
- **AWS Amplify** (hosting)
- **Tailwind CSS v4**

## Variables de entorno

```env
MONGODB_URI=mongodb+srv://...
ADMIN_USER=admin
ADMIN_PASS=tu_password
S3_REGION=us-east-1
S3_BUCKET=nombre-bucket
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
KEEPALIVE_SECRET=una_clave_secreta  # opcional, protege el endpoint de ping
```

## Desarrollo local

```bash
npm install
npm run dev
```

## Keep-alive de MongoDB

MongoDB Atlas Free Tier (M0) puede pausar conexiones inactivas. Para evitarlo, el proyecto incluye un endpoint de ping:

```
GET /api/keepalive?secret=TU_KEEPALIVE_SECRET
```

Respuesta exitosa:
```json
{ "status": "ok", "db": "connected", "timestamp": "..." }
```

### Configurar ping automático (gratis)

Usa uno de estos servicios para llamar al endpoint cada 10 minutos:

1. **[cron-job.org](https://cron-job.org)** — Gratis, sin límites
   - URL: `https://tu-dominio.com/api/keepalive?secret=TU_SECRET`
   - Intervalo: cada 10 minutos

2. **[UptimeRobot](https://uptimerobot.com)** — Gratis hasta 50 monitores
   - Tipo: HTTP(s)
   - Intervalo: 5 minutos

3. **[Better Uptime](https://betterstack.com/uptime)** — Gratis tier disponible

## Deploy en AWS Amplify

Asegúrate de agregar todas las variables de entorno en la consola de Amplify antes de hacer deploy.
