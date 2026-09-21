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
