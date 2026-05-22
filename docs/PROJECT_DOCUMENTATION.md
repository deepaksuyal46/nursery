# Uttarakhand Succulent - Complete Project Documentation

## 1. Project Overview

**Project name:** Uttarakhand Succulent  
**Project type:** Full-stack nursery e-commerce web application  
**Repository style:** JavaScript/TypeScript monorepo with separate frontend and backend workspaces  
**Business domain:** Plant and nursery storefront for browsing, wishlisting, cart management, checkout, order history, and admin catalog/order operations

This project is a production-oriented nursery shopping platform built around:

- public plant discovery
- OTP-based email registration
- JWT login/authentication
- customer cart, checkout, orders, and wishlist
- admin analytics, catalog management, and order status management
- responsive plant-focused UI with dark mode and lightweight animation

The current implementation uses:

- **Angular 19** standalone frontend
- **Tailwind CSS** plus custom global CSS
- **Node.js + Express** backend
- **PostgreSQL** relational database
- **JWT** auth with role-based access control
- **Multer** for image uploads
- **AOS** for scroll-triggered frontend animations

This documentation reflects the current repository state in:

- `frontend/`
- `backend/`
- `database/`
- `docs/`

## 2. High-Level Architecture

```text
Browser
  |
  v
Angular 19 Frontend
  - standalone components
  - guards
  - interceptors
  - services
  - runtime-config based API target
  |
  v
Express API (/api/*)
  - auth
  - plants
  - cart
  - orders
  - wishlist
  - admin
  |
  v
PostgreSQL
  - users
  - pending_registrations
  - plants
  - carts + cart_items
  - orders + order_items
  - wishlists + wishlist_items
```

Supporting runtime pieces:

- `/uploads` static file serving for admin-uploaded images
- email delivery through **Resend** or **SMTP**
- local runtime config generation for the frontend

## 3. Monorepo Structure

```text
.
├── backend/                  Express API
├── database/                 SQL schema and seed scripts
├── docs/                     Documentation
├── frontend/                 Angular application
├── tools/                    Local dev orchestration scripts
├── uploads/                  Uploaded plant images
├── docker-compose.yml        Local PostgreSQL
├── render.yaml               Render deployment definition
├── package.json              Root workspace scripts
└── README.md                 Shorter repo guide
```

### 3.1 Backend structure

```text
backend/src
├── app.js
├── server.js
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
└── validators/
```

### 3.2 Frontend structure

```text
frontend/src/app
├── app.component.ts
├── app.config.ts
├── app.routes.ts
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── layout/
│   ├── services/
│   └── types/
├── features/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── contact/
│   ├── home/
│   ├── orders/
│   ├── plants/
│   └── wishlist/
└── shared/
    ├── components/
    ├── pipes/
    └── contact-info.ts
```

## 4. Technology Stack

### 4.1 Frontend

- Angular `^19.2.0`
- Standalone components only
- Angular Router
- Angular Reactive Forms
- Angular signals/computed state
- Angular HttpClient with interceptors
- Tailwind CSS `^3.4.17`
- AOS `^2.3.4`
- Custom CSS in `frontend/src/styles.css`

### 4.2 Backend

- Node.js ESM (`"type": "module"`)
- Express `^4.21.2`
- PostgreSQL driver `pg`
- JWT via `jsonwebtoken`
- File upload via `multer`
- Logging via `morgan`
- Security headers via `helmet`
- CORS via `cors`
- OTP email via `nodemailer` or `Resend`

### 4.3 Database

- PostgreSQL 16 for local Docker setup
- normalized schema with foreign keys, uniqueness constraints, and indexes

## 5. Root Workspace and Commands

Root `package.json` defines the monorepo workspaces and convenience scripts.

### 5.1 Root scripts

- `npm start`
  - runs `tools/start-dev.mjs`
  - starts backend and frontend together
- `npm run dev:backend`
  - starts backend watch mode
- `npm run dev:frontend`
  - starts Angular dev server
- `npm run start:backend`
  - starts backend without watch mode
- `npm run build:frontend`
  - production build for Angular

### 5.2 `tools/start-dev.mjs`

This script:

- auto-creates `backend/.env.local` from `backend/.env.example` if missing
- injects local defaults:
  - `FRONTEND_API_BASE_URL=http://localhost:4000/api`
  - `FRONTEND_ASSET_BASE_URL=http://localhost:4000`
- starts:
  - `npm --prefix backend run dev`
  - `npm --prefix frontend run start`
- shuts both down together on process exit

## 6. Backend Documentation

## 6.1 Backend entry points

### `backend/src/app.js`

Creates and configures the Express app:

- builds the allowed CORS origin list
- enables JSON/body parsing
- enables `helmet`
- enables `morgan`
- attaches the database pool to each request
- serves `/uploads`
- exposes `/api/health`
- mounts `/api/*` feature routes
- installs `notFound` and `errorHandler`

### `backend/src/server.js`

Runtime boot sequence:

1. ensure `pending_registrations` table exists
2. inspect email transport configuration
3. verify mail transport where possible
4. start server on configured port
5. close DB pool on shutdown

## 6.2 Backend configuration

### `backend/src/config/env.js`

Reads environment values from:

- `backend/.env.local`
- `backend/.env`

Important values:

- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `CLIENT_URLS`
- `ALLOW_DEV_OTP_IN_PRODUCTION`
- `DATABASE_URL`
- `DATABASE_SSL`
- `DATABASE_SSL_REJECT_UNAUTHORIZED`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `UPLOAD_DIR`
- `MAX_FILE_SIZE`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `SMTP_SERVICE`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `OTP_EXPIRES_MINUTES`

### `backend/src/config/db.js`

Creates a PostgreSQL connection pool and exports:

- `query(text, params)`
- `withTransaction(callback)`
- default `pool`

### `backend/src/config/bootstrap.js`

Only auto-creates:

- `pending_registrations`

Important consequence:

- on a brand-new database, running the app is **not enough**
- you still must apply `database/schema.sql`

### `backend/src/config/multer.js`

Handles admin image uploads:

- destination: `UPLOAD_DIR` resolved to an absolute path
- file naming: timestamp + UUID + original extension
- validation: image MIME types only
- max size: `MAX_FILE_SIZE` from env

## 6.3 Backend middleware

### `auth.middleware.js`

- `attachDatabase(db)` attaches `req.db`
- `authenticate` validates `Authorization: Bearer <token>`
- `authorize(...roles)` enforces RBAC

### `error.middleware.js`

Centralized JSON error responses for:

- `multer` errors
- PostgreSQL unique violations (`23505`)
- bad type casts (`22P02`)
- custom `ApiError`
- generic internal errors

## 6.4 Backend route map

Mounted under `/api`.

### Auth

- `POST /api/auth/register/request-otp`
- `POST /api/auth/register/verify-otp`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Plants

- `GET /api/plants`
- `GET /api/plants/:plantId`
- `POST /api/plants` - ADMIN
- `PUT /api/plants/:plantId` - ADMIN
- `DELETE /api/plants/:plantId` - ADMIN

### Cart

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/:itemId`
- `DELETE /api/cart/items/:itemId`

### Orders

- `GET /api/orders`
- `POST /api/orders/checkout`
- `GET /api/orders/:orderId`

### Wishlist

- `GET /api/wishlist`
- `POST /api/wishlist/items`
- `DELETE /api/wishlist/items/:plantId`

### Admin

- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:orderId/status`
- `GET /api/admin/plants`

### Health

- `GET /api/health`

Health response includes:

- API status
- timestamp
- email delivery health summary

## 6.5 Backend domain logic

### 6.5.1 Authentication and registration

Implemented in `auth.controller.js`.

Registration flow:

1. validate `name`, `email`, `password`
2. reject if user already exists
3. hash password with `scrypt`
4. generate 6-digit OTP
5. hash OTP using `sha256(jwtSecret:email:otp)`
6. upsert into `pending_registrations`
7. deliver OTP:
   - by email when configured
   - by development response fallback when allowed
8. return challenge data:
   - `email`
   - `expiresInMinutes`
   - `deliveryMethod`
   - `devOtp` only in development/fallback mode

OTP verification flow:

1. validate email and OTP format
2. load pending registration
3. reject if missing or expired
4. compare OTP hashes safely
5. create `users` row in a transaction
6. create user cart
7. create user wishlist
8. delete pending registration
9. sign JWT and return session

Login flow:

1. validate email/password presence
2. load user by email
3. verify `scrypt` password hash
4. sign JWT
5. return `{ token, user }`

`GET /auth/me` reloads the current user from the DB.

### 6.5.2 Plant catalog

Implemented across `plant.controller.js` and `plant.model.js`.

Features:

- public listing supports:
  - text search over name/description/category
  - category
  - min/max price
  - in-stock filter
  - sorting
  - pagination
- public catalog only returns `is_active = true`
- admin listing can include inactive plants
- plant slugs are auto-generated and de-duplicated
- deleting a plant is a **soft archive**
  - sets `is_active = false`
  - does not physically delete row

Supported sort keys:

- `newest`
- `priceAsc`
- `priceDesc`
- `nameAsc`
- `stockDesc`

### 6.5.3 Cart

Implemented across `cart.controller.js` and `cart.model.js`.

Rules:

- every user gets exactly one cart
- adding an existing plant increases quantity instead of duplicating the row
- requested quantity may not exceed current stock
- only active plants can be added
- cart summary is derived server-side:
  - `items`
  - `itemCount`
  - `totalPrice`

### 6.5.4 Orders and checkout

Implemented across `order.controller.js` and `order.model.js`.

Checkout rules:

1. validate shipping payload
2. lock cart rows using `FOR UPDATE`
3. reject empty cart
4. reject inactive plants
5. reject insufficient stock
6. compute total price
7. create order with initial status `PENDING`
8. create `order_items` snapshots
9. decrement plant stock
10. clear cart items
11. return fully populated order with items

Important behavior:

- order items snapshot plant name and image URL at purchase time
- order access is scoped:
  - users can only read their own orders
  - admins can read any order

Admin order features:

- paginated listing
- status filtering
- text search by customer name, email, or order ID
- status updates

Allowed statuses:

- `PENDING`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

### 6.5.5 Wishlist

Implemented across `wishlist.controller.js` and `wishlist.model.js`.

Rules:

- every user gets exactly one wishlist
- only active plants appear in wishlist output
- duplicate adds are ignored via unique constraint + `ON CONFLICT DO NOTHING`

### 6.5.6 Admin analytics

Admin dashboard metrics include:

- total revenue
- order count
- pending order count
- user count
- active plant count
- top 5 revenue-driving plants
- 5 most recent orders with item details

## 6.6 Validators

Validation files:

- `auth.validator.js`
- `plant.validator.js`
- `cart.validator.js`
- `order.validator.js`

Key validation rules:

- password must be at least 8 chars and contain uppercase, lowercase, and number
- OTP must be 6 digits
- plant price must be non-negative
- stock must be non-negative integer
- cart quantities must be positive integers
- shipping email must be valid
- all checkout address fields except line 2 are required

## 6.7 Utility modules

- `jwt.js`
  - signs JWT using `sub`, `role`, `email`
- `password.js`
  - `scrypt` hashing and verification
- `otp.js`
  - OTP generation and secure comparison
- `mailer.js`
  - email configuration inspection
  - Resend send path
  - SMTP send path
  - transport verification
- `pagination.js`
  - pagination helpers
- `slug.js`
  - plant slug generation
- `ApiError.js`
  - structured application errors
- `asyncHandler.js`
  - async controller wrapper

## 7. Frontend Documentation

## 7.1 Frontend bootstrap

### `main.ts`

Bootstraps `AppComponent` using `appConfig`.

### `app.config.ts`

Registers:

- router with scroll restoration
- HttpClient using `fetch`
- interceptors:
  - auth
  - loading
  - error
- browser animations

### `app.component.ts`

- renders only `<app-shell />`
- initializes AOS after first paint
- refreshes AOS on navigation end

## 7.2 Frontend shell

`core/layout/shell.component.ts` is the global app frame.

It renders:

- navbar
- router outlet
- footer
- toast container
- global loading spinner

Boot-time shell behavior:

1. initialize theme
2. restore auth session from localStorage
3. if token exists:
   - call `/auth/me`
   - load cart
   - load wishlist
4. if `/auth/me` fails:
   - logout locally

## 7.3 Frontend routing

Defined in `frontend/src/app/app.routes.ts`.

### Public routes

- `/`
- `/plants`
- `/plants/:plantId`
- `/contact`
- `/login`
- `/register`

### Authenticated routes

- `/cart`
- `/orders`
- `/wishlist`

### Admin routes

- `/admin/dashboard`
- `/admin/plants`
- `/admin/plants/new`
- `/admin/plants/:plantId/edit`
- `/admin/orders`
- `/admin/users`

### Redirects

- `/admin` -> `/admin/dashboard`
- unknown route -> `/`

## 7.4 Frontend guards

### `auth.guard.ts`

- allows access only when `AuthService.isAuthenticated()` is true
- otherwise redirects to `/login`

### `admin.guard.ts`

- allows access only when `AuthService.isAdmin()` is true
- otherwise redirects to `/`

## 7.5 Frontend interceptors

### `auth.interceptor.ts`

- attaches `Authorization: Bearer <token>` when a session exists

### `loading.interceptor.ts`

- increments/decrements global loading state per request

### `error.interceptor.ts`

- extracts backend error message
- shows toast for most request failures
- suppresses duplicate toast for login 401
- logs user out and redirects to `/login` when an authenticated request returns 401

## 7.6 Frontend services

### `AuthService`

Responsibilities:

- OTP request
- OTP verification
- login
- `/auth/me` refresh
- session persistence in localStorage
- computed auth/admin state

Storage key:

- `nursery.auth.session`

### `PlantService`

- list public plants
- list admin plants
- get plant by id
- create plant
- update plant
- archive plant

### `CartService`

- load cart
- add item
- update item quantity
- remove item
- expose `cart`, `itemCount`, `totalPrice`

### `OrderService`

- checkout
- fetch paginated user orders
- fetch order detail

### `WishlistService`

- load wishlist
- add item
- remove item
- compute `has(plantId)`

### `AdminService`

- analytics
- paginated admin orders
- order status updates
- paginated users

### `ThemeService`

- stores current theme in localStorage under `nursery.theme`
- respects system dark preference on first load
- toggles `html.dark`

### `ToastService`

- transient success/error/info toasts
- auto-dismiss after 3.5 seconds

### `LoadingService`

- request counter used by the overlay spinner

## 7.7 Frontend data models

Defined in `frontend/src/app/core/types/models.ts`.

Main interfaces:

- `ApiResponse<T>`
- `PaginatedResponse<T>`
- `User`
- `AuthSession`
- `RegistrationOtpChallenge`
- `Plant`
- `PlantFilters`
- `CartItem`
- `Cart`
- `CheckoutPayload`
- `OrderItem`
- `Order`
- `Wishlist`
- `Analytics`

## 7.8 Frontend pages and flows

### Home page

File: `features/home/home.component.ts`

Features:

- animated hero section
- search box that routes to `/plants?q=...`
- category quick links
- featured plants from newest inventory
- add-to-cart and wishlist from home cards

### Plant catalog

File: `features/plants/plants-list.component.ts`

Features:

- filter UI
- query-param driven state
- pagination
- URL-synced search/filter values
- add-to-cart
- wishlist toggle

### Plant detail

File: `features/plants/plant-detail.component.ts`

Features:

- full image
- category and stock badges
- price and description
- add-to-cart
- wishlist toggle

### Login

File: `features/auth/login.component.ts`

Features:

- reactive form
- password show/hide
- login
- on success:
  - load cart
  - load wishlist
  - redirect:
    - admin -> `/admin/dashboard`
    - user -> `/plants`

### Register

File: `features/auth/register.component.ts`

Features:

- OTP-first registration
- development OTP visibility when email delivery is not configured
- resend OTP
- lock name/email/password after OTP request
- auto-login after OTP verification

### Cart / checkout

File: `features/cart/cart.component.ts`

Features:

- delivery details form
- live order summary
- quantity updates
- item removal
- checkout submit
- success redirect to `/orders`

### Orders

File: `features/orders/orders.component.ts`

Features:

- paginated order history
- item snapshots
- status badges

### Wishlist

File: `features/wishlist/wishlist.component.ts`

Features:

- saved plants grid
- add wishlist item to cart
- remove wishlist item

### Contact

File: `features/contact/contact.component.ts`

Current business identity data:

- address: Bhimtal, Nainital
- phone: `+91 99170 38595`
- email: `uttarakhandsucculentbhimtal@gmail.com`
- hours: `Mon - Sun: 6 AM to 10 PM`

### Admin dashboard

File: `features/admin/admin-dashboard.component.ts`

Features:

- analytics cards
- top-selling plants
- recent orders

### Admin orders

File: `features/admin/admin-orders.component.ts`

Features:

- search by user or order ID
- status filter
- status update dropdown
- pagination

### Admin plants

File: `features/admin/admin-plants.component.ts`

Features:

- paginated catalog management
- archive plant action
- link to create/edit form

### Admin plant form

File: `features/admin/admin-plant-form.component.ts`

Features:

- create or edit mode
- reactive form
- image URL or file upload
- image preview
- active/inactive toggle

### Admin users

File: `features/admin/admin-users.component.ts`

Features:

- paginated user table
- name, email, role, joined date

## 7.9 Shared UI components

Reusable shared pieces include:

- `NavbarComponent`
- `FooterComponent`
- `PlantCardComponent`
- `SearchFiltersComponent`
- `PaginationComponent`
- `OrderStatusBadgeComponent`
- `EmptyStateComponent`
- `ToastContainerComponent`
- `SpinnerComponent`
- `AssetUrlPipe`

### Current header behavior

The current navbar is:

- sticky
- compact glass-style desktop header
- icon-based actions for cart, wishlist, orders, theme toggle
- profile dropdown for authenticated users
- mobile drawer menu

There is **no dedicated `/profile` route** in the current application.

## 7.10 Styling and theme system

### Tailwind

Tailwind config extends:

- `moss`
- `fern`
- `sage`
- `seed`
- `bark`
- `clay`

Plus:

- `shadow-soft`
- `bg-hero-texture`

### Global CSS

Main styling file:

- `frontend/src/styles.css`

Global patterns defined there include:

- theme CSS variables
- dark mode variable overrides
- `.surface-card`
- `.btn-primary`
- `.btn-secondary`
- `.field`
- brand and header styles
- home hero styles
- checkout styles
- reduced-motion handling
- AOS import

### AOS

- imported globally from `aos/dist/aos.css`
- typed locally via `frontend/src/aos.d.ts`
- initialized in `AppComponent`

## 7.11 Runtime config strategy

Frontend API targets are runtime-driven.

Files involved:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`
- `src/environments/runtime-config.ts`
- `scripts/write-runtime-config.mjs`
- `src/assets/runtime-config.js`

How it works:

1. build/start script writes `runtime-config.js`
2. `index.html` loads that script before Angular bootstrap
3. frontend reads:
   - `apiBaseUrl`
   - `assetBaseUrl`
4. environment defaults apply if runtime values are absent

This lets the same frontend build point to different backends without rebuilding code.

## 8. Database Documentation

## 8.1 Enums

- `user_role`
  - `USER`
  - `ADMIN`
- `order_status`
  - `PENDING`
  - `PROCESSING`
  - `SHIPPED`
  - `DELIVERED`
  - `CANCELLED`

## 8.2 Tables

### `users`

Stores registered users.

Important columns:

- `id`
- `name`
- `email` unique
- `password_hash`
- `role`
- timestamps

### `pending_registrations`

Temporary storage for OTP registration flow.

Important columns:

- `email` primary key
- `name`
- `password_hash`
- `otp_hash`
- `expires_at`

### `plants`

Catalog records.

Important columns:

- `name`
- `slug` unique
- `description`
- `image_url`
- `category`
- `price`
- `stock`
- `is_active`

### `carts`

One cart per user.

Important constraint:

- `user_id` unique

### `cart_items`

Cart contents.

Important constraint:

- unique `(cart_id, plant_id)`

### `orders`

Completed checkouts with shipping data.

### `order_items`

Line items with immutable snapshots:

- `plant_name_snapshot`
- `plant_image_url_snapshot`
- `price`
- `quantity`

### `wishlists`

One wishlist per user.

### `wishlist_items`

Saved plants per wishlist.

Important constraint:

- unique `(wishlist_id, plant_id)`

## 8.3 Indexes

The schema includes indexes for:

- user role
- OTP expiry
- plant category/price/stock/activity
- cart item joins
- order joins/status/date
- wishlist joins

## 8.4 Seed data

`database/seed.sql` currently inserts:

- 2 users
  - `admin@nursery.com`
  - `user@nursery.com`
- carts for both users
- wishlists for both users
- 8 plants
- sample cart items
- sample wishlist items
- 1 delivered sample order
- 2 sample order items

Note:

- the repo contains **hashed passwords only**
- plaintext seed passwords are **not documented in the repository**

## 9. Authentication, Authorization, and Security

## 9.1 Authentication model

- stateless JWT auth
- token stored in browser localStorage
- token sent through Angular auth interceptor
- backend validates token and reloads user from DB

## 9.2 Authorization model

- `USER` and `ADMIN` roles
- backend authorization enforced per route
- frontend route guards mirror backend role checks

## 9.3 Password security

- `scrypt` hashing
- per-password random salt
- timing-safe comparison

## 9.4 OTP security

- 6-digit numeric OTP
- stored as SHA-256 hash
- verification uses timing-safe comparison
- OTP expiration configurable, default 10 minutes

## 9.5 HTTP/security headers

- `helmet` enabled
- static uploads allowed cross-origin by policy
- CORS allowlist enforced

## 9.6 CORS behavior

Allowed origins come from:

- `CLIENT_URLS`
- `CLIENT_URL`
- plus local defaults:
  - `http://localhost:4200`
  - `http://127.0.0.1:4200`

## 10. Local Development Setup

## 10.1 Prerequisites

- Node.js
- npm
- PostgreSQL

Optional:

- Docker for local Postgres

## 10.2 Database start

```bash
docker compose up -d postgres
```

Default local DB:

- host: `localhost`
- port: `5432`
- db: `nursery_store`
- user: `postgres`
- password: `postgres`

## 10.3 Apply schema and seed

```bash
psql -U postgres -d nursery_store -f database/schema.sql
psql -U postgres -d nursery_store -f database/seed.sql
```

## 10.4 Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## 10.5 Environment

Create:

- `backend/.env`
or rely on:
- `backend/.env.local`

Reference values live in:

- `backend/.env.example`

## 10.6 Start all services

```bash
npm start
```

Expected local URLs:

- frontend: `http://localhost:4200`
- backend: `http://localhost:4000`
- API base: `http://localhost:4000/api`

## 11. Deployment

## 11.1 Docker Compose

Only PostgreSQL is defined in `docker-compose.yml`.

This repo does **not** define a full multi-container app stack in Docker.

## 11.2 Render

`render.yaml` defines two services:

### Backend Render service

- type: web
- runtime: node
- rootDir: `backend`
- build: `npm install`
- start: `npm start`
- health path: `/api/health`

### Frontend Render service

- type: static
- rootDir: `frontend`
- build: `npm install && npm run build`
- publish path: `./frontend/dist/frontend/browser`
- rewrite: `/* -> /index.html`

## 11.3 Render environment notes

Backend requires real values for:

- `CLIENT_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- email delivery env vars if OTP email must work

Frontend requires:

- `FRONTEND_API_BASE_URL`
- `FRONTEND_ASSET_BASE_URL`

Important production note:

- backend only auto-creates `pending_registrations`
- you still must run `database/schema.sql` on a fresh hosted DB

## 12. Assets and Media

Frontend assets currently include:

- `placeholder-plant.svg`
- `runtime-config.js`
- `uttarakhand-succulent-logo.png`
- `uttarakhand-succulent-logo.svg`

Plant images can come from:

- external URLs
- uploaded files under `/uploads/...`

`AssetUrlPipe` resolves relative backend asset paths using `environment.assetBaseUrl`.

## 13. Current UI/UX Characteristics

The current frontend has already been customized toward a premium nursery ecommerce look.

Notable current UI patterns:

- glassmorphism cards
- cream/green nursery color palette
- sticky responsive navbar
- animated hero/home sections
- OTP-based premium register page
- animated premium checkout page
- dark mode support
- AOS-based scroll reveal on key surfaces

## 14. Known Constraints and Observations

1. **No automated tests are currently present**
   - no app-level `.spec` or `.test` files were found under `frontend/src` or `backend/src`

2. **Plant deletion is archival**
   - admin delete sets `is_active = false`

3. **No profile page route exists**
   - account actions currently live in navbar dropdown and auth services

4. **Shipping is currently fixed as free in UI**
   - checkout summary shows free shipping
   - no separate shipping fee logic is implemented

5. **Coupon/promo logic is not implemented**

6. **Order payment integration is not present**
   - checkout currently places an order directly from cart

7. **Backend bootstrap is partial**
   - only `pending_registrations` is ensured automatically

8. **Seed user passwords are not documented**
   - only hashed values are stored

9. **Uploads are filesystem-based**
   - no object storage integration is present

10. **Contact page is informational**
   - no backend contact form flow exists currently

## 15. Recommended Next Documentation Extensions

If you want this documentation expanded further, the next useful additions would be:

- sequence diagrams for auth/cart/checkout
- ER diagram for the PostgreSQL schema
- full endpoint request/response examples for every API
- Postman collection
- deployment runbook
- contributor guide and code conventions
- testing strategy document

## 16. Reference Files

Use these files as the main source of truth:

- `README.md`
- `docs/api.md`
- `backend/src/app.js`
- `backend/src/server.js`
- `backend/src/routes/*.js`
- `backend/src/controllers/*.js`
- `backend/src/models/*.js`
- `database/schema.sql`
- `database/seed.sql`
- `frontend/src/app/app.routes.ts`
- `frontend/src/app/core/services/*.ts`
- `frontend/src/app/features/**/*.ts`
- `frontend/src/styles.css`

