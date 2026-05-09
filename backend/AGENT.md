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
├── middleware/
│   └── authMiddleware.js # JWT verification and request protection
├── models/              # Sequelize model definitions (mapped to SQLite tables)
│   ├── Category.js
│   ├── Product.js
│   ├── Customer.js
│   ├── Order.js
│   └── OrderDetail.js
│   └── User.js          # Authentication user model
├── routes/
│   ├── auth.js          # Registration and Login endpoints
│   └── reports.js       # Protected analytical report endpoints
├── seeders/
│   └── seed.js          # Database initialization and dummy data population
└── server.js            # App entry point and server configuration
```

## Key Implementation Details

### 1. Authentication Flow
- **Registration:** `POST /api/auth/register` $\rightarrow$ Hashes password $\rightarrow$ Stores in `Users` table.
- **Login:** `POST /api/auth/login` $\rightarrow$ Verifies hash $\rightarrow$ Issues JWT.
- **Protection:** Reports routes are wrapped in `authMiddleware`. Requests must include `Authorization: Bearer <token>`.

### 2. Reporting Logic
The `/api/reports` endpoints implement complex SQL logic via Sequelize:
- **Joins:** Used for mapping customers to orders and orders to products.
- **Aggregations:** `SUM` for revenue and `COUNT` for category statistics.
- **SQLite Specifics:** Date differences are calculated using `julianday` functions via `sequelize.literal`.

### 3. Database Lifecycle
- **Sync:** The server calls `sequelize.sync()` on startup.
- **Seeding:** Run `node seeders/seed.js` to wipe the database and populate it with the required training data.

## Development Commands
- **Start Server:** `node server.js`
- **Populate Data:** `node seeders/seed.js`
- **Run Tests:** `node test-auth.js` (Auth flow) or `node test-api.js` (Report flow).

## Constraints & Guidelines
- **Security:** Do not log plain-text passwords.
- **Consistency:** Follow the existing `belongsTo` / `hasMany` relationship patterns in models.
- **Database:** Since SQLite is used, avoid SQL Server-specific T-SQL syntax (like `IDENTITY`) inside the JS code; rely on Sequelize's `autoIncrement`.
