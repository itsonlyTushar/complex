# Complex — Food Court Management Platform

A multi-tenant SaaS platform for managing food courts and their restaurants. It handles QR-code customer ordering, Stripe payments, restaurant vendor dashboards, food court operations, and a super admin control panel.

---

## Overview

The platform serves three user roles:

| Role | Portal | Description |
|---|---|---|
| **Super Admin** | `/sp` | Onboards food courts, monitors platform activity, manages commissions |
| **Food Court Admin** | `/court` | Manages restaurants, tables, and floor layout within their court |
| **Restaurant Vendor** | `/admin` | Manages menu, handles orders, views payment analytics |

Customers access a public menu at `/public/:foodCourtId/:restaurantId?tableId=X`, browse items, add to cart, and pay via Stripe without logging in.

---

## Tech Stack

### Client (`/client`)
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui components
- Zustand (cart), TanStack Query (server state)
- React Hook Form + Zod validation
- Stripe.js (`@stripe/react-stripe-js`)
- Framer Motion, GSAP, Lenis smooth scroll

### Server (`/server`)
- Node.js, Express 5, TypeScript (`tsx`)
- Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg`, `pg`)
- JWT authentication (`jsonwebtoken`) and bcrypt password hashing
- Stripe SDK (Stripe Connect, PaymentIntents, webhooks)
- Cloudinary (menu and restaurant images)
- Joi validation

### Infrastructure
- PostgreSQL 17
- Docker & Docker Compose
- Production deployment ready (Render / Railway)

---

## Project Structure

```
complex/
├── client/
│   └── src/
│       ├── app/
│       │   ├── admin/       # Restaurant vendor dashboard
│       │   ├── court/       # Food court admin dashboard
│       │   ├── sp/          # Super admin panel
│       │   ├── public/      # Customer menu and ordering flow
│       │   ├── login/       # Authentication
│       │   └── signup/
│       ├── components/
│       │   ├── admin/
│       │   ├── court/
│       │   ├── marketing/
│       │   ├── public/
│       │   └── ui/          # shadcn/ui components
│       ├── constants/
│       ├── hooks/           # React Query queries and mutations
│       ├── lib/             # API client, toast utility, schemas
│       ├── services/        # Client API request handlers
│       ├── stores/          # Zustand cart store
│       └── types/
│
├── server/
│   └── src/
│       ├── config/          # Database, Cloudinary
│       ├── controllers/     # Route controllers
│       ├── middleware/      # Auth, error handling
│       ├── routes/          # Express route definitions
│       ├── services/        # Business logic and database queries
│       ├── types/
│       ├── utils/           # Password hashing, JWT tokens
│       ├── app.ts           # Express app setup and middleware
│       └── server.ts        # Server entry point
│   └── prisma/
│       └── schema.prisma
│
├── docker-compose.yml
└── render.yaml
```

---

## Data Model

Core entities and relationships:

- **FoodCourt**: Top-level tenant. Contains restaurants, tables, and admins. Stores floor layout (walls, infrastructure) and currency configuration.
- **Restaurant**: Belongs to a food court. Contains vendors, menu items, categories, and orders. Holds Stripe Connect account details and commission rate.
- **User**: Assigned one of three roles (`SUPER_ADMIN`, `FOOD_COURT_ADMIN`, `RESTAURANT_VENDOR`). Associated with a food court or restaurant.
- **Menu**: Item with name, price, cost, inventory quantity, image, and optional category.
- **Category**: Groups menu items within a restaurant.
- **Order**: Customer order containing status (`PENDING → PREPARING → READY → COMPLETED`), table number, total amount, Stripe payment intent ID, and line items.
- **OrderItem**: Quantity, price snapshot, and menu reference for an order.
- **Table**: Floor table with shape (square, rectangle, round), capacity, placement state, and canvas coordinates.

---

## Key Features

- **Customer Ordering (`/public/:foodCourtId/:restaurantId`)**: Scanned via table QR code. Full category-based menu browsing, persistent cart, embedded Stripe checkout, and live order status tracking.
- **Restaurant Vendor Dashboard (`/admin`)**: Live orders board with status controls; manual order entry sheet for walk-in/cash orders; menu catalog with Cloudinary image upload; table list; revenue analytics showing net payout and gross margin.
- **Food Court Admin Dashboard (`/court`)**: Restaurant onboarding and management; interactive canvas floor plan editor supporting walls, tables, and service zones (bar, kitchen, entrance, stalls).
- **Super Admin Panel (`/sp`)**: Food court onboarding and configuration; activity auditing; platform-wide restaurant commission management.

---

## API Routes

### Health & System
| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/health` | Service health status check | Public |

### Auth & Tenant Administration
| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/new-court` | Register a new food court | Public |
| `POST` | `/api/auth/signup` | Create a vendor user for a restaurant | Court Admin |
| `POST` | `/api/auth/login` | Authenticate user and issue JWT | Public |
| `GET` | `/api/auth/courts` | List all registered food courts | Public / Admin |
| `PATCH` | `/api/auth/courts/:id` | Update food court details and admin credentials | Super Admin |
| `DELETE` | `/api/auth/courts/:id` | Delete food court and cascade delete all related data | Super Admin |

### Food Courts & Restaurants
| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/court/public/:foodCourtId/restaurants` | List restaurants in a food court | Public |
| `GET` | `/api/court/public/restaurant/:id` | Get single restaurant details | Public |
| `GET` | `/api/court/my-id` | Get current authenticated user's food court ID | Protected |
| `GET` | `/api/court/restaurants` | List restaurants belonging to admin's court | Court Admin |
| `PATCH` | `/api/court/restaurants/:id` | Update restaurant information | Court Admin |
| `DELETE` | `/api/court/restaurants/:id` | Delete restaurant and cascade delete associated records | Court Admin |

### Menu & Categories
| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/menus` | Fetch menu items (optionally by restaurantId) | Public / Vendor |
| `POST` | `/api/add-menu` | Create a menu item with image | Vendor |
| `DELETE` | `/api/delete-menu` | Delete a menu item | Vendor |
| `GET` | `/api/categories` | List categories for vendor's restaurant | Vendor |
| `POST` | `/api/add-category` | Create a category | Vendor |
| `PUT` | `/api/update-category` | Update category name | Vendor |
| `DELETE` | `/api/delete-category` | Delete a category | Vendor |

### Tables & Floor Plan
| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/add-table` | Register a new table | Court Admin |
| `GET` | `/api/get-tables` | Get all tables for court | Court Admin |
| `POST` | `/api/save-layout` | Save canvas floor layout, walls, and placed tables | Court Admin |
| `GET` | `/api/get-layout` | Fetch floor layout and table positions | Court Admin |

### Orders
| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/add-order` | Place customer order and decrement inventory | Public |
| `GET` | `/api/orders` | Get orders for vendor's restaurant | Vendor |
| `GET` | `/api/public/orders` | Get active orders for a specific table | Public |
| `PUT` | `/api/update-order` | Update order items and totals | Vendor |
| `PATCH` | `/api/status-update` | Update order progress (`PENDING`, `PREPARING`, `COMPLETED`, `CANCELLED`) | Vendor |
| `PATCH` | `/api/cancel-order` | Cancel order, trigger refund, and restore inventory | Vendor |
| `GET` | `/api/payment-details` | Revenue, commission, net payout, and cost of goods breakdown | Vendor |

### Payments & Stripe Connect
| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/payments/create-payment` | Create Stripe PaymentIntent with application fee | Public |
| `POST` | `/api/payments/webhook` | Process Stripe webhook events | Stripe |
| `POST` | `/api/payments/onboard-restaurant` | Generate Stripe Connect onboarding link | Vendor |
| `POST` | `/api/payments/verify-onboarding` | Check Stripe Connect account status | Vendor |
| `POST` | `/api/payments/refund` | Refund payment intent | Vendor |
| `GET` | `/api/payments/restaurants-commission` | List commission rates across all restaurants | Super Admin |
| `PATCH` | `/api/payments/restaurants-commission/:id` | Update commission rate for a restaurant | Super Admin |

### Dashboards & User Profile
| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/vendor` | Vendor dashboard counters and analytics | Vendor |
| `GET` | `/api/dashboard/court` | Court admin overview and restaurant count | Court Admin |
| `GET` | `/api/dashboard/super-admin` | Super admin system overview | Super Admin |
| `GET` | `/api/users/me` | Current authenticated user profile | Protected |
| `PUT` | `/api/users/update-logo` | Upload/update restaurant logo | Vendor |
| `PUT` | `/api/users/update-restaurant-status` | Toggle restaurant open or closed status | Vendor |

---

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

### Run with Docker

```bash
docker compose up --build
```

Services:
- Client: `http://localhost:3000`
- Server: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

### Environment Variables

**Client** (`client/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Server** (`server/.env`):
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/complex
JWT_SECRET=your_jwt_secret
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
npm run dev         # tsx watch on port 5000

# Client
cd client
npm install
npm run dev         # Next.js on port 3000
```

### Deploying the Server on Render

The repository includes `render.yaml`, configuring a managed PostgreSQL database and the API web service.

1. Create a Blueprint in Render and connect this repository.
2. Fill in the environment variables marked `sync: false` in `render.yaml`.
3. Render automatically provisions the database and sets `DATABASE_URL`.
