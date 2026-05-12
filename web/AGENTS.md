# AGENTS.md - NovaStore Web Frontend

This document provides guidance for AI agents working on the NovaStore frontend application.

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand (with persist middleware for auth/cart)
- **API Client:** Axios
- **Icons:** Lucide-React
- **Form Handling:** React Hook Form

## Project Structure

```
web/src/
├── app/               # Next.js App Router (pages, layouts, route groups)
│   ├── admin/         # Admin panel (staff-only protected routes)
│   │   ├── login/     # Staff login page
│   │   ├── (dashboard)/  # Protected dashboard layout and routes
│   │   └── components/    # Admin-specific components (Sidebar, ReportsTable, MetricCard)
│   ├── login/         # User login page
│   ├── products/      # Product catalog and details
│   └── cart/          # Shopping cart flow (with auth-gated checkout)
├── components/        # React components
│   ├── ui/            # Basic atomic components (Button, Input, etc.)
│   ├── layout/        # Global layout components (Navbar, Footer)
│   ├── home/          # Home page components (SidebarFilters, Hero)
│   └── products/      # Product components (ProductGrid, ProductCard)
├── services/          # API service layers and Axios configurations
│   ├── authService.ts  # Auth endpoints and axios instance (with token-routing interceptor)
│   ├── productService.ts # Product listing and details
│   └── orderService.ts  # Order creation endpoint
├── store/             # Zustand store definitions (auth, cart, filter)
└── data/              # Mock data and constants
```

## Development Guidelines

### 1. Component Patterns
- **UI Components:** Always prefer using existing components in `src/components/ui` before creating new ones.
- **Naming:** Use PascalCase for components and kebab-case for files (unless it's a Next.js special file like `page.tsx` or `layout.tsx`).
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary (check `globals.css`).

### 2. State Management
- Use **Zustand** for global state (Auth, Cart, Filters).
- Use local `useState` for component-specific UI state.
- Keep stores lean and separate by concern (e.g., `authStore.ts`, `cartStore.ts`).
- **Auth Store Pattern:** The auth store uses `AuthSession<T>` generic interface with two separate sessions:
  - `userAuth`: Regular user authentication (from `/api/auth/login`)
  - `staffAuth`: Staff authentication (from `/api/staff/login`)
- **Auth Session Usage:**
  ```typescript
  const { userAuth, staffAuth } = useAuthStore();
  // Check auth: staffAuth.isAuthenticated
  // Access user: staffAuth.user (contains role, email, id)
  // Set auth: staffAuth.setAuth(user, token)
  // Logout: staffAuth.logout()
  ```
- **Admin Login JWT Decoding:** On successful staff login, the JWT payload is decoded with `atob(token.split('.')[1])` to extract `staffId`, `email`, and `role` instead of hardcoding values.
- **Custom Persist Merge:** The store uses a custom `merge` function so persisted data (`user`, `token`, `isAuthenticated`) is deep-merged into the session objects, preserving `setAuth`/`logout` methods across rehydration.
- **API Token Handling:** The Axios interceptor parses `config.url` with `new URL()` to extract the request pathname. Routes containing `/staff/` or `/reports/` use the staffAuth token; all other routes use the userAuth token.

### 4. Filter State Management
- **Filter Store (`filterStore.ts`):** Manages product filtering state (category, price range, sort, search)
- **Filter Behavior:**
  - **Search:** Resets filters to defaults, then applies search with default category/price
  - **Filter Change after Search:** Combines search query with selected filters
  - **Clear Search Input:** Returns to default filters
- **Available Filters:**
  - **Categories:** All, Elektronik, Giyim, Ev ve Yaşam, Kozmetik, Kitap (must match backend Turkish names)
  - **Price Ranges:** All Prices, Under 500, 500-2000, 2000-10000, Over 10000
- **Clear Filters:** Use `resetFilters()` to clear all filters including search query

### 3. API Communication
- Use `authService` for authentication endpoints (login, signup, etc.)
- Use `productService` for product-related API calls (`getProducts`, `getProductById`)
- Use `orderService` for creating orders (checkout flow)
- Import the axios instance from `authService.ts` for other API needs
- Use the configured Axios instance to ensure base URLs and auth headers are handled automatically
- Always handle loading and error states in the UI

**Product Service Usage:**
```typescript
import { productService, Product, ProductDetail } from '@/services/productService';

// List all products
const products = await productService.getProducts();

// Filter by category (Turkish: Elektronik, Giyim, Ev ve Yaşam, Kozmetik, Kitap)
const products = await productService.getProducts('Elektronik');

// Filter by category with price range
const products = await productService.getProducts('Elektronik', 500, 2000);

// Filter with search query
const products = await productService.getProducts(undefined, undefined, undefined, 'telefon');

// Get single product
const product = await productService.getProductById('1');
```

**Order Service Usage:**
```typescript
import { orderService } from '@/services/orderService';

// Create an order (user must be authenticated)
const order = await orderService.createOrder([
  { productId: '1', quantity: 2 },
  { productId: '3', quantity: 1 },
]);
```

### 4. Navigation & Routing
- Use `next/link` for internal navigation.
- Use `useRouter` from `next/navigation` for programmatic redirects.
- Use route groups (e.g., `(dashboard)`) to organize layouts without affecting the URL structure.

### 5. Admin Panel (Staff Space)
- **Separation:** Admin panel (`/admin`) uses separate authentication from regular users.
- **Login:** Staff login at `/admin/login` calls `POST /api/staff/login` with `{email, password}`.
- **Protection:** `AdminLayout` checks `staffAuth.isAuthenticated`. Non-staff users are redirected to `/admin/login`.
- **RBAC:** Backend enforces `role === 'admin'` for all `/api/reports/*` endpoints.
- **Reports:** All report pages handle `401` (redirect to login) and `403` (access denied) errors gracefully.

## Quality Assurance

- **Linting:** Run `npm run lint` before finalizing any changes.
- **Type Safety:** Avoid using `any`. Define interfaces for API responses and component props.
- **Responsive Design:** Ensure all new features are mobile-first and responsive.

## Key Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint.
