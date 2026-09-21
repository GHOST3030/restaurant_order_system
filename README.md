# Restaurant Order System

A full-stack restaurant ordering system built with **Laravel** (API backend) and **React** (frontend), featuring authentication, role-based access control, an admin panel, and full Arabic/English translation with RTL support.

## Stack

- **Backend:** Laravel 12, Sanctum (API tokens), spatie/laravel-permission (roles), SQLite
- **Frontend:** React 19 (Vite), React Router, Axios, i18next (react-i18next)

## Requirements covered

- **Authentication:** register/login/logout with token-based auth (Sanctum); users have a profile page to view and update their name, email, and password.
- **Admin Panel:** `/admin` — dashboard with stats, menu item management, category management, order management (update order status), and user management (change roles, delete users).
- **Roles:** `admin`, `manager`, `user` via spatie/laravel-permission. Admin has full access (including user management); Manager can manage menu/categories/orders; User can browse, order, and manage their own profile.
- **Translation:** Arabic and English via i18next, with a language switcher that also toggles page direction (RTL for Arabic).
- **Interfaces (8+):** Login, Register, Menu (home), Cart/Checkout, My Orders, Profile, Admin Dashboard, Admin Menu Items, Admin Categories, Admin Orders, Admin Users.

## Getting started

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

The API runs at `http://localhost:8000/api`.

Seeded accounts (password: `password` for all):

| Role    | Email                     |
|---------|----------------------------|
| Admin   | admin@restaurant.test      |
| Manager | manager@restaurant.test    |
| User    | customer@restaurant.test   |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and talks to the API via `VITE_API_URL` (see `frontend/.env`).

## Project structure

```
backend/   Laravel API (auth, roles, menu, orders, admin endpoints)
frontend/  React SPA (pages, i18n, auth/cart contexts)
```

## Deployment

The backend and frontend deploy as two separate services. Config files are already in the repo:

- `backend/Dockerfile` + `.dockerignore` — containerized Laravel API (PHP 8.3, Postgres + SQLite drivers). Works on Render, Railway, Fly.io, or any Docker host.
- `backend/Procfile` + `backend/nixpacks.toml` — alternative build for Railway's native Nixpacks builder (no Docker needed).
- `render.yaml` — a [Render Blueprint](https://render.com/docs/blueprint-spec) that provisions the backend (Docker web service), a Postgres database, and the frontend (static site) in one shot: on Render, **New → Blueprint**, point it at this repo, and set the two `sync: false` env vars (`FRONTEND_URLS` on the backend, `VITE_API_URL` on the frontend) once both service URLs are known.
- `frontend/vercel.json` — SPA rewrite rule for Vercel (so client-side routes like `/cart` don't 404 on refresh).
- `frontend/netlify.toml` — same, for Netlify.

### Quick path: Railway (backend) + Vercel (frontend)

1. **Backend on Railway:** New Project → Deploy from GitHub repo → set root directory to `backend`. Add a Postgres plugin. Set env vars from `backend/.env.example` plus `APP_ENV=production`, `APP_DEBUG=false`, `DB_CONNECTION=pgsql` (and the DB_* values Railway gives you), and `FRONTEND_URLS=<your-vercel-url>`. Railway will pick up the `Procfile`/`nixpacks.toml` automatically.
2. **Frontend on Vercel:** New Project → import repo → root directory `frontend` → framework Vite. Set `VITE_API_URL=https://<your-railway-app>.up.railway.app/api`.
3. Redeploy the backend once you know the final Vercel URL so `FRONTEND_URLS` (used by `backend/config/cors.php`) is correct.

### One-shot path: Render Blueprint

1. On Render: **New → Blueprint**, select this repo (`render.yaml` is auto-detected).
2. Render provisions the backend Docker service and frontend static site together (no database or card required — the backend runs on SQLite by default, re-seeded on every deploy).
3. After the first deploy, set `FRONTEND_URLS` (backend) and `VITE_API_URL` (frontend) to each other's live URLs, then trigger a **Manual Deploy → Deploy latest commit** on both.

> Note: on Render's free plan the container's disk isn't persistent, so the SQLite database resets (re-seeded) on every redeploy or restart — fine for a demo/school project. If you need data to survive redeploys, add a managed Postgres (Render, Railway, Supabase, or Neon all have one) and set `DB_CONNECTION=pgsql` + the `DB_HOST`/`DB_PORT`/`DB_DATABASE`/`DB_USERNAME`/`DB_PASSWORD` env vars on the backend service.

### Notes

- Auth uses Sanctum **token** auth (`Authorization: Bearer <token>`), not cookies — no `SANCTUM_STATEFUL_DOMAINS` needed, just correct CORS origins in `FRONTEND_URLS`.
- Switch the seeded demo accounts' passwords (or remove the seeder's demo users) before sharing a live deployment.
