# LoteAutos

Plataforma de gestión y venta de vehículos. Portal público para clientes y panel de administración.

## Stack

- **Frontend:** Vue 3 + Vite + Pinia + Tailwind CSS
- **Backend:** Vercel API Routes (serverless)
- **Base de datos:** MongoDB Atlas
- **Auth:** JWT en cookie httpOnly

---

## Requisitos

- Node.js 18+
- Cuenta en [MongoDB Atlas](https://cloud.mongodb.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) (gratis)

---

## Correr en local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el `.env` con tus valores:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/loteautos?...
JWT_SECRET=una_cadena_larga_y_aleatoria_minimo_32_caracteres
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_contraseña
NODE_ENV=development
```

### 3. Login en Vercel CLI (solo la primera vez)

```bash
npx vercel login
```

### 4. Arrancar el proyecto

```bash
npx vercel dev
```

Abre [http://localhost:3000](http://localhost:3000)

| Ruta | Descripción |
|---|---|
| `/` | Portal de clientes |
| `/catalogo` | Catálogo de vehículos |
| `/admin` | Panel de administración |

---

## Desplegar en Vercel

### 1. Agregar variables de entorno en Vercel

En el dashboard de Vercel → tu proyecto → **Settings → Environment Variables**:

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar JWT |
| `ADMIN_USERNAME` | Usuario del panel admin |
| `ADMIN_PASSWORD` | Contraseña del admin (desarrollo) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt de la contraseña (producción, reemplaza a `ADMIN_PASSWORD`) |
| `NODE_ENV` | `production` |

### 2. Deploy

Cada `git push` a `main` hace deploy automático.

O manualmente:

```bash
vercel --prod
```

---

## Generar hash de contraseña (producción)

En lugar de guardar la contraseña en texto plano, genera un hash bcrypt:

```bash
node -e "import('bcryptjs').then(({default:b})=>console.log(b.hashSync('TU_CONTRASEÑA',10)))"
```

Usa el resultado como valor de `ADMIN_PASSWORD_HASH` en Vercel y elimina `ADMIN_PASSWORD`.

---

## API Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/logout` | Público |
| GET | `/api/auth/me` | Público |
| GET | `/api/cars` | Público (solo activos) |
| GET | `/api/cars?all=1` | Admin |
| POST | `/api/cars` | Admin |
| GET | `/api/cars/:id` | Público |
| PUT | `/api/cars/:id` | Admin |
| DELETE | `/api/cars/:id` | Admin |
| GET | `/api/leads` | Admin |
| POST | `/api/leads` | Público |
| PUT | `/api/leads/:id` | Admin |
| DELETE | `/api/leads/:id` | Admin |
| GET | `/api/dashboard` | Admin |
