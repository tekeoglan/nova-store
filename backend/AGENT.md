# Backend Agent Guide: NovaStore API

This document provides guidance for AI agents working on the NovaStore backend service.

## Overview
The NovaStore backend is a RESTful API designed to manage an e-commerce database. It provides administrative reports on stock, sales, and customer behavior.

## Tech Stack
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** SQLite (`novastore.sqlite`)
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs` for password hashing.

## Project Structure
```text
backend/
├── config/
│   └── database.js      # Sequelize connection and SQLite storage path
├── database/
│   └── seed.js          # Database initialization and dummy data population
├── middleware/
│   ├── authMiddleware.js      # JWT verification for user authentication
│   └── staffAuthMiddleware.js # JWT verification and role check for staff
├── models/              # Sequelize model definitions (mapped to SQLite tables)
│   ├── Category.js
│   ├── Product.js
│   ├── Customer.js      # Customer profile data
│   ├── Order.js
│   ├── OrderDetail.js
│   ├── User.js          # User authentication model (references Customer)
│   └── Staff.js         # Staff authentication model (admin/moderator roles)
├── routes/
│   ├── auth.js          # User registration and login endpoints
│   ├── staffAuth.js     # Staff login endpoint
│   ├── products.js      # Public product listing endpoints
│   └── reports.js       # Admin-only analytical report endpoints
├── tests/
│   ├── test-auth.js     # User auth integration tests
│   ├── test-api.js      # Report endpoint tests
│   └── run-staff-test.js # Staff auth and RBAC tests
└── server.js            # App entry point and server configuration
```

## Key Implementation Details

### 1. Authentication Flow

#### Public Product Endpoints
Product endpoints are publicly accessible (no authentication required):
- `GET /api/products` - List all products, optional query: `?category=CategoryName`
- `GET /api/products/:id` - Get single product with category and related products

**Product Response Shape:**
```json
{
  "id": "1",
  "name": "Product Name",
  "category": "Category Name",
  "price": 299.00,
  "oldPrice": 349.00,
  "rating": 4.5,
  "reviews": 120,
  "image": "https://...",
  "isSale": true
}
```

#### User Authentication
- **Registration:** `POST /api/auth/signup` $\rightarrow$ Accepts `{username, password, fullName, email}` $\rightarrow$ Creates `Customer` and `User` in a transaction $\rightarrow$ User references Customer via `CustomerID` foreign key.
- **Login:** `POST /api/auth/login` $\rightarrow$ Verifies hash against `PasswordHash` $\rightarrow$ Issues JWT.

#### Staff Authentication
- **Login:** `POST /api/staff/login` $\rightarrow$ Accepts `{email, password}` $\rightarrow$ Verifies against `Staff` model $\rightarrow$ Issues JWT with `type: 'staff'` and `role: 'admin'|'moderator'`.

### 2. Authorization Flow
- **Reports Protection:** `/api/reports` routes are secured with `staffAuth` middleware (verifies staff token) and `isAdmin` middleware (verifies `role === 'admin'`).
- **User Space:** Regular users authenticated via `authMiddleware` cannot access staff routes.
- **Admin Space:** Staff members with `admin` role can access reports. Other roles (e.g., `moderator`) are blocked with `403 Forbidden`.

### 3. Reporting Logic
The `/api/reports` endpoints implement complex SQL logic via Sequelize:
- **Joins:** Used for mapping customers to orders and orders to products.
- **Aggregations:** `SUM` for revenue and `COUNT` for category statistics.
- **SQLite Specifics:** Date differences are calculated using `julianday` functions via `sequelize.literal`.

### 4. Database Lifecycle
- **Sync:** The server calls `sequelize.sync()` on startup.
- **Seeding:** Run `node server.js` in development mode to auto-seed data (Categories, Products, Customers, Orders, Users, and Staff).

### 5. Default Staff Accounts (Seeded)
| Email | Password | Role |
|-------|----------|------|
| admin@novastore.com | admin123 | admin |
| mod@novastore.com | mod123 | moderator |

## Development Commands
- **Start Server:** `node server.js`
- **Populate Data:** Run `node server.js` in development mode (auto-seeds on startup)
- **Run Tests:** `node tests/test-auth.js` (User auth flow) or `node tests/run-staff-test.js` (Staff auth and RBAC).

## Constraints & Guidelines
- **Security:** Do not log plain-text passwords.
- **Consistency:** Follow the existing `belongsTo` / `hasMany` relationship patterns in models.
- **Database:** Since SQLite is used, avoid SQL Server-specific T-SQL syntax (like `IDENTITY`) inside the JS code; rely on Sequelize's `autoIncrement`.
