# InvenTech — Prueba Técnica Grupo 1

Sistema de gestión de inventario compuesto por un frontend en React (SPA) y tres microservicios independientes de backend (autenticación, inventario y reportes). Cada proyecto tiene su propio `package.json`, `node_modules` y ciclo de vida — no hay un `package.json` en la raíz del monorepo.

## Estructura del monorepo

| Carpeta | Rol | Runtime | Base de datos | Puerto por defecto |
|---|---|---|---|---|
| `frontend/` | SPA de administración (UI) | React 19 + Vite | — | `5173` (dev) |
| `server-auth/` | Registro, login, JWT, perfiles de usuario | Node/Express + Sequelize | PostgreSQL | `3005` |
| `service-inventory/` | CRUD de productos, entradas y salidas de inventario | Node/Express + Mongoose | MongoDB | `3007` |
| `service-reports/` | Alertas de stock y reportes agregados | Node/Express + Mongoose | MongoDB | `3008` |

## Puesta en marcha

Cada servicio se instala y ejecuta por separado desde su propia carpeta:

```bash
cd <carpeta-del-servicio>
npm install            # o pnpm install (hay lockfiles de ambos en varios servicios)
npm run dev             # levanta el servicio en modo desarrollo (nodemon / vite)
```

Los backends leen su configuración desde un `.env` propio (no versionado): credenciales de base de datos, `JWT_SECRET` / `JWT_ISSUER` / `JWT_AUDIENCE`, SMTP y, en el caso de `server-auth`, credenciales de Cloudinary para el almacenamiento de fotos de perfil.

El frontend usa las siguientes variables de entorno, apuntando a `http://localhost:<puerto>/api/v1`:

- `VITE_AUTH_URL`
- `VITE_INVENTORY_URL`
- `VITE_REPORTS_URL`
- `VITE_API_URL` (fallback genérico)

`server-auth` incluye un `docker-compose.yml` que levanta un contenedor local de PostgreSQL 16 (`prueba_postgres`, puerto host `5436 → 5432`) para desarrollo.

### Scripts destacados

- `frontend`: `npm run dev`, `npm run build` (producción con Vite), `npm run preview`.
- `server-auth`: único servicio con lint/format configurado — `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check` (ESLint flat config + Prettier).
- Ningún servicio tiene actualmente una suite de pruebas automatizada configurada.

## Arquitectura de backend

Los tres servicios backend comparten la misma estructura interna:

```
configs/        # conexión a base de datos, configuración de la app (configs/app.js -> initServer)
middlewares/     # validaciones, rate limiting, JWT, manejo de errores
helpers/         # lógica auxiliar reutilizable (emails, uploads, builders, etc.)
src/<dominio>/   # *.controller.js, *.model.js, *.routes.js por dominio de negocio
index.js         # punto de entrada
```

Todos exponen su API bajo el prefijo `/api/v1` y un endpoint `GET /api/v1/health`.

### `server-auth` (PostgreSQL / Sequelize)

Modelos principales (`src/users/user.model.js`): `User`, `UserProfile`, `UserEmail`, `UserPasswordReset`, relacionados 1:1 sobre `user_id`, con columnas en `snake_case`. En desarrollo (`NODE_ENV=development`) sincroniza el esquema con `sequelize.sync({ alter: true })` al iniciar, y hace seed de roles y de un usuario administrador al arrancar.

Rutas bajo `/api/v1/auth`:

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/register` | Registra un usuario nuevo (multipart, admite foto de perfil) |
| `POST` | `/login` | Autentica con email/username + contraseña, devuelve JWT |
| `POST` | `/verify-email` | Confirma el email con el token enviado |
| `POST` | `/resend-verification` | Reenvía el email de verificación |
| `POST` | `/forgot-password` | Inicia el flujo de recuperación de contraseña |
| `POST` | `/reset-password` | Cambia la contraseña usando el token de recuperación |
| `GET` | `/profile` | Perfil del usuario autenticado (requiere JWT) |
| `POST` | `/profile/by-id` | Perfil de un usuario dado su `userId` |

### `service-inventory` (MongoDB / Mongoose)

Hace seed de un producto temporal si la colección está vacía (`src/seed/products.seed.js`).

Rutas bajo `/api/v1`:

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/products` | Crea un producto |
| `GET` | `/products` | Lista productos |
| `GET` | `/products/search` | Busca productos por nombre o categoría |
| `GET` | `/products/categories` | Lista categorías |
| `POST` | `/products/categories` | Agrega una categoría |
| `GET` | `/products/:id` | Obtiene un producto por id |
| `PUT` | `/products/:id` | Actualiza un producto |
| `PUT` | `/products/:id/activate` | Activa un producto |
| `PUT` | `/products/:id/deactivate` | Desactiva un producto |
| `POST` | `/entries` | Registra una entrada de inventario |
| `POST` | `/outputs` | Registra una salida de inventario |
| `GET` | `/history` | Historial combinado de movimientos |
| `GET` | `/history/entries` | Historial de entradas |
| `GET` | `/history/outputs` | Historial de salidas |

### `service-reports` (MongoDB / Mongoose)

Consume datos de productos vía `helpers/inventory-service.js` (llamada HTTP a `service-inventory`).

Rutas bajo `/api/v1` (requieren JWT):

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/alerts/low-stock` | Productos por debajo del umbral de stock |
| `GET` | `/alerts/out-of-stock` | Productos agotados |
| `GET` | `/reports/top-products` | Ranking de productos más movidos |
| `GET` | `/reports/categories` | Reporte agregado por categoría |
| `GET` | `/reports/summary` | Resumen general de inventario |

`helpers/pdf-builder.js` y `helpers/xlsx-builder.js` proveen la generación de documentos PDF/XLSX a partir de los datos de reportes.

### Autenticación entre servicios

El JWT se emite **solo** en `server-auth` y se valida de forma **descentralizada** en cada servicio usando el mismo `JWT_SECRET` / `JWT_ISSUER` / `JWT_AUDIENCE` compartido — `service-inventory` y `service-reports` no llaman de vuelta a auth para validar el token:

- `server-auth/middlewares/validate-JWT.js`: decodifica el JWT y además busca al usuario en PostgreSQL (`findUserById`) para confirmar que sigue existiendo/activo; puebla `req.user` / `req.userId`.
- `service-inventory/middlewares/validate-JWT.js` y su equivalente en `service-reports`: solo decodifican el token y confían en sus claims (`sub`, `role`, `jti`); pueblan `req.account` (`{ id, jti, iat, role }`), sin consultar ninguna base de datos.

El control de acceso por rol (`middlewares/validate-role.js`, `requireRole(...roles)`) se apoya en `req.account.role`. Los roles válidos (`server-auth/helpers/role-constants.js`) son `'Administrador'` y `'Coordinador'`.

> Al modificar el flujo de login/JWT hay que mantener sincronizados `JWT_SECRET`, `JWT_ISSUER` y `JWT_AUDIENCE` entre los tres `.env`, o los tokens dejarán de validar en los servicios downstream.

## Arquitectura de frontend

React 19 + Vite + Tailwind CSS v4 + Zustand + React Router v7 + Axios, con arquitectura basada en features:

```
src/app/       # bootstrap, rutas (AppRoutes.jsx) y layouts (DashboardLayout, Sidebar, Topbar)
src/features/  # auth, inventory, products, reports — cada uno con su store/ (Zustand) y pages/ / components/
src/shared/    # api/, components/, store/ y utils/ compartidos entre features
```

### Rutas de la SPA

| Ruta | Página | Acceso |
|---|---|---|
| `/` | `AuthPage` (login/registro) | Público |
| `/verify-email` | `VerifyEmailPage` | Público |
| `/reset-password` | `ResetPasswordPage` | Público |
| `/unauthorized` | `UnauthorizedPage` | Público |
| `/dashboard` | `DashboardHomePage` | Protegido |
| `/dashboard/products` | `ProductsPage` | Protegido |
| `/dashboard/inventory` | `InventoryPage` | Protegido |
| `/dashboard/entries` | `EntryPage` | Protegido |
| `/dashboard/outputs` | `OutputPage` | Protegido |
| `/dashboard/alerts` | `AlertsPage` | Protegido |
| `/dashboard/reports` | `ReportsPage` | Protegido |

Las rutas protegidas usan `ProtectedRoute`, basado en `useAuthStore().isAuthenticated`.

### Capa de datos

`src/shared/api/api.js` define una instancia Axios por microservicio (`axiosAuth`, `axiosInventory`, `axiosReports`, más `axiosApi` como fallback genérico):

- Un interceptor de request inyecta `Authorization: Bearer <token>` desde `useAuthStore`, salvo en las rutas públicas de auth.
- Un interceptor de response solo fuerza logout en `401` cuando el propio servicio de auth confirma que el token es inválido/expirado (`shouldEndSessionOn401`) — un `401` aislado de inventory/reports no cierra la sesión.

Las llamadas HTTP se encapsulan siempre en funciones dentro de `shared/api/*.js` (nunca directo en JSX) y se consumen desde los stores/hooks de cada feature.

### Sistema de diseño

Paleta de marca "Busy Bee" centralizada como tokens semánticos en `src/styles/index.css` (Tailwind v4 `@theme`): `cacao-ink`, `honeycomb`, `cream-comb`, `honey-nectar`, `sky-trace`, `pollen`, `danger`. No se usa hex hardcodeado en componentes. Tipografías: Fraunces (display/títulos) y Barlow (UI/body). Contraste obligatorio: texto `cacao-ink` sobre `bg-honey-nectar`, texto `cream-comb` sobre `bg-cacao-ink`.

Nomenclatura: componentes/páginas en `PascalCase`, hooks/utils/stores en `camelCase`.
