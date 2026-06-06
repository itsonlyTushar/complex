# Complex — Food Court Management Platform

A multi-tenant SaaS platform for managing food courts and their restaurants. It handles everything from QR-code-based customer ordering and Stripe payments, to restaurant vendor dashboards and a super admin control panel.

---

## Overview

The platform serves three distinct user roles:

| Role | Portal | Description |
|---|---|---|
| **Super Admin** | `/sp` | Onboards food courts, monitors activity, manages commissions |
| **Food Court Admin** | `/court` | Manages restaurants, tables, and floor layout within their court |
| **Restaurant Vendor** | `/admin` | Manages menu, handles orders, views payment analytics |

Customers access a public-facing menu at `/public/:foodCourtId/:restaurantId?tableId=X`, browse items, add to cart, and pay via Stripe — all without logging in.

---

## Tech Stack

### Client (`/client`)
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **State:** Zustand (cart), TanStack Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Payments:** Stripe.js (`@stripe/react-stripe-js`)
- **Animations:** Framer Motion, GSAP

### Server (`/server`)
- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript (compiled via `tsx`)
- **ORM:** Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Auth:** JWT (`jsonwebtoken`) + bcrypt password hashing
- **Payments:** Stripe SDK (Connect + webhooks)
- **Media:** Cloudinary (restaurant/menu images)
- **Validation:** Joi

### Infrastructure
- **Database:** PostgreSQL 17
- **Containerization:** Docker + Docker Compose
- **Server hosting:** Railway (`complex-server-production.up.railway.app`)

---

## Project Structure

```
complex/
├── client/                  # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── admin/       # Restaurant vendor dashboard
│       │   ├── court/       # Food court admin dashboard
│       │   ├── sp/          # Super admin panel
│       │   ├── public/      # Customer-facing menu & ordering
│       │   ├── login/       # Auth pages
│       │   └── signup/
│       ├── components/
│       ├── hooks/           # React Query hooks
│       ├── stores/          # Zustand stores (cart)
│       └── types/
│
├── server/                  # Express API
│   └── src/
│       ├── controllers/     # Route handlers (auth, court, menu, order, payments, tables, user)
│       ├── services/        # Business logic
│       ├── routes/          # Express routers
│       ├── middleware/      # Auth, error handling
│       ├── models/
│       ├── types/
│       └── utils/           # JWT tokens, password hashing
│   └── prisma/
│       └── schema.prisma    # Database schema
│
└── docker-compose.yml
```

---

## Data Model

Core entities and their relationships:

- **FoodCourt** — top-level tenant; has restaurants, tables, and admins; configures currency and payment system
- **Restaurant** — belongs to a food court; has vendors, menus, categories, and orders; holds Stripe Connect account details and commission rate
- **User** — one of three roles (`SUPER_ADMIN`, `FOOD_COURT_ADMIN`, `RESTAURANT_VENDOR`); associated with a food court or restaurant
- **Menu** — a food item with name, price, cost, image, description, and optional category
- **Category** — groups menu items within a restaurant
- **Order** — placed by a customer at a table; has status (`PENDING → PREPARING → READY → COMPLETED`), Stripe payment intent ID, and line items
- **OrderItem** — a menu item quantity within an order
- **Table** — belongs to a food court; has shape (square/rectangle/round), capacity, and canvas coordinates for the floor layout map

---

## Key Features

### Customer Ordering (`/public/:foodCourtId/:restaurantId`)
- Scanned via QR code at a table; `tableId` is passed as a URL query param
- Browse the full menu grouped by category, with search
- Add/remove items in a persistent cart (Zustand)
- Pay via Stripe (Elements embedded checkout)
- Real-time order status tracking (Pending → Preparing → Ready → Completed)

### Restaurant Vendor Dashboard (`/admin`)
- **Orders** — live order cards with status progression controls and cancellation; manual order entry via punch dialog
- **Menu** — add, edit, and remove menu items with Cloudinary image uploads
- **Tables** — view assigned tables
- **Payments** — revenue breakdown: total, commission paid, net received, and real profit (after cost of goods)
- **Settings** — account management, menu categories, Stripe Connect onboarding

### Food Court Admin Dashboard (`/court`)
- **Restaurants** — list, edit, and remove restaurants in the court
- **Tables** — interactive canvas-based floor plan editor; drag and drop tables (square, rectangle, round) and infrastructure elements (bar, kitchen, gate, shop stall); draw walls; save layout to the database
- **Settings** — manage court tables configuration, accounts, and payment settings

### Super Admin Panel (`/sp`)
- **Onboard Court** — register a new food court with name, location, admin credentials, currency (USD/INR), and payment system
- **Activity** — platform-wide activity log
- **Payments** — commission management across all restaurants (view and update per-restaurant commission rates)

---

## API Routes

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/new-court` | Register a new food court |
| `POST` | `/api/auth/signup` | Create a user (auth required) |
| `POST` | `/api/auth/login` | Authenticate and get JWT |
| `GET` | `/api/auth/courts` | List all food courts |
| `GET` | `/api/court/public/:foodCourtId/restaurants` | Public restaurant list |
| `GET` | `/api/court/public/restaurant/:id` | Public restaurant details |
| `GET` | `/api/court/restaurants` | Restaurants for court admin (auth) |
| `GET` | `/api/orders` | Orders for vendor (auth) |
| `POST` | `/api/add-order` | Place a new order (public) |
| `PATCH` | `/api/status-update` | Update order status (auth) |
| `PATCH` | `/api/cancel-order` | Cancel an order (auth) |
| `GET` | `/api/payment-details` | Payment analytics for vendor (auth) |
| `POST` | `/api/payments/create-payment` | Create Stripe payment intent (public) |
| `POST` | `/api/payments/webhook` | Stripe webhook handler |
| `POST` | `/api/payments/onboard-restaurant` | Stripe Connect onboarding (auth) |
| `GET` | `/api/payments/restaurants-commission` | Commission overview (auth) |
| `PATCH` | `/api/payments/restaurants-commission/:id` | Update commission rate (auth) |

---

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

### Run with Docker

```bash
docker compose up --build
```

This starts three services:
- `client` → http://localhost:3000
- `server` → http://localhost:5000
- `db` → PostgreSQL on port 5432

### Environment Variables

**Client** (`client/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Server** (`server/.env`):
```env
DATABASE_URL=postgresql://postgres:password@db:5432/complex
JWT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:3000
```

### Local Development (without Docker)

```bash
# Server
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev         # tsx watch, port 5000

# Client
cd client
npm install
npm run dev         # Next.js dev server, port 3000
```

---

## Database Migrations

Prisma migrations live in `server/prisma/migrations/`. To create a new one:

```bash
cd server
npx prisma migrate dev --name your_migration_name
```
