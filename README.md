# NovaStore

A full-stack e-commerce application for premium tech products with a modern tech stack across web, mobile, and API.

## Project Structure

```
nova-store/
├── backend/          # Express.js REST API with SQLite
├── web/              # Next.js web frontend
├── mobile/           # Flutter mobile app
├── skills/           # AI coding agent skills (OpenCode)
├── assets/           # Shared assets
├── docker-compose.yml
└── AGENTS.md
```

## Features

- **Product Catalog** — Browse, search, filter by category, price range, and sort
- **Product Detail** — Image gallery, color selector, features, technical specs, related products
- **Shopping Cart** — Add/remove items, quantity steppers, order summary with shipping & tax
- **User Accounts** — Register, login, profile with order history
- **Admin Panel** — Dashboard, reports, low-stock alerts, order history (staff-only)
- **Responsive Web** — Mobile-first Next.js app with server-side rendering
- **Mobile Client** — Cross-platform Flutter app (Android/iOS)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express 5, Sequelize ORM, SQLite, JWT auth |
| **Web Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand |
| **Mobile** | Flutter, Dart, Riverpod, GoRouter, Dio |
| **Infrastructure** | Docker, docker-compose |

## Quick Start (Docker)

```bash
# Clone and start all services
git clone <repo-url> nova-store
cd nova-store
docker compose up --build
```

- Web app: http://localhost:3000
- Backend API: http://localhost:8080/api

### Seeded Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@novastore.com | admin123 |
| Moderator | mod@novastore.com | mod123 |

| UserName | Password |
|------|-------|
| admin | admin123 |

## Setup Without Docker

### Prerequisites

- Node.js 20+
- npm
- Flutter SDK 3.11+ (for mobile)

### Backend

```bash
cd backend
npm install
node server.js
```

The API starts on http://localhost:8080/api. On first run in development mode, the database is automatically created and seeded with categories, products, and sample data.

### Web Frontend

```bash
cd web
npm install
npm run dev
```

The web app starts on http://localhost:3000 and connects to the backend at `http://localhost:8080/api` by default. To use a different URL, set the `NEXT_PUBLIC_API_URL` environment variable.

### Mobile (Flutter)

```bash
cd mobile
flutter pub get
flutter run --dart-define=BACKEND_URL=http://10.0.2.2:8080/api
```

For Android emulator, use `10.0.2.2` (maps to host localhost). For iOS simulator or web, use `localhost`.

## API Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/products` | GET | — | List products (filter: `category`, `minPrice`, `maxPrice`, `search`) |
| `/api/products/:id` | GET | — | Product detail with related products |
| `/api/auth/login` | POST | — | User login → JWT |
| `/api/auth/signup` | POST | — | User registration |
| `/api/auth/me` | GET | JWT | Current user profile |
| `/api/orders` | GET | JWT | Order history |
| `/api/orders` | POST | JWT | Create order `{ items: [{ productId, quantity }] }` |
| `/api/staff/login` | POST | — | Staff login |
| `/api/reports/*` | GET | Admin | Sales, category, inventory reports |
| `/api/reports/low-stock` | GET | Admin | Low-stock products |

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port |
| `JWT_SECRET` | `"secret"` | JWT signing secret |
| `WEB_URL` | `http://localhost:3000` | CORS allowed origin |
| `NODE_ENV` | `"development"` | Enables auto-seeding in dev |

### Web (Build-time)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | Backend API base URL |

### Mobile (Build-time)

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8080/api` | Backend API base URL |

## License

MIT
