# WAYTRIP Backend (Initial Setup)

This is the initial Node.js + Express + PostgreSQL backend for WAYTRIP.

## 1) Folder structure

```bash
backend/
  .env.example
  package.json
  README.md
  sql/
    init.sql
  src/
    app.js
    server.js
    config/
      env.js
    db/
      pool.js
      init.js
    middleware/
      auth.js
    modules/
      auth/
        auth.controller.js
        auth.routes.js
        auth.service.js
    routes/
      index.js
```

## 2) Prerequisites

- Node.js 18+
- PostgreSQL running locally (or remote)

## 3) Setup

```bash
cd backend
cp .env.example .env
npm install
```

Update `.env` values:

- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (long random string)

Example:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/waytrip
JWT_SECRET=super-long-random-secret
JWT_EXPIRES_IN=7d
```

## 4) Run server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## 5) API endpoints

Base URL: `http://localhost:4000/api`

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (requires `Authorization: Bearer <token>`)
- `GET /destinations`
- `GET /destinations/:id`
- `POST /destinations`
- `PUT /destinations/:id`
- `DELETE /destinations/:id`
- `GET /packages`
- `POST /packages`
- `PUT /packages/:id`
- `DELETE /packages/:id`
- `POST /bookings` (requires JWT)
- `GET /bookings/me` (requires JWT)
- `POST /admin/destinations` (admin/super_admin)
- `POST /admin/packages` (admin/super_admin)
- `GET /admin/users` (admin/super_admin)
- `GET /admin/bookings` (admin/super_admin)
- `POST /admin/notifications` (admin/super_admin)
- `GET /admin/notifications` (admin/super_admin)
- `GET /crm/bookings` (CRM_MANAGER/super_admin)
- `PATCH /crm/bookings/:id/status` (CRM_MANAGER/super_admin)
- `PATCH /crm/bookings/:id/notes` (CRM_MANAGER/super_admin)
- `GET /crm/users?search=` (CRM_MANAGER/super_admin)
- `GET /crm/users/:id/history` (CRM_MANAGER/super_admin)
- `PATCH /crm/users/:id/contact` (CRM_MANAGER/super_admin)
- `GET /notifications/my` (authenticated user)
- `PATCH /notifications/:id/read` (authenticated user)
- `GET /offers`
- `GET /offers/validate?code=&packageId=`
- `POST /admin/offers` (admin/super_admin)
- `GET /admin/website-settings` (super_admin)
- `PUT /admin/website-settings` (super_admin)
- `GET /analytics/overview` (admin/super_admin/CRM_MANAGER)
- `GET /experiences/my` (authenticated user)
- `GET /experiences/booking/:bookingId` (authenticated booking owner)
- `PUT /experiences/booking/:bookingId` (authenticated booking owner)

### Register body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "traveler"
}
```

To grant CRM access, update a user role to `CRM_MANAGER` in your database.

### Login body

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

## 6) Connect with `login.html`

`login.html` now posts credentials to `/api/auth/login` using `login-auth.js`.

To test end-to-end:

1. Start backend: `cd backend && npm run dev`
2. Open: `http://localhost:4000/login.html`
3. Create a user first with register API (for now via curl/Postman), then log in from the UI.

Example register request:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Demo","lastName":"User","email":"demo@waytrip.com","password":"secret123"}'
```
