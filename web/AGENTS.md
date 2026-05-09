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
│   ├── admin/         # Admin panel (protected routes)
│   ├── products/      # Product catalog and details
│   └── cart/          # Shopping cart flow
├── components/        # React components
│   ├── ui/            # Basic atomic components (Button, Input, etc.)
│   ├── layout/        # Global layout components (Navbar, Footer)
│   └── [feature]/     # Feature-specific components
├── services/          # API service layers and Axios configurations
├── store/             # Zustand store definitions
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

### 3. API Communication
- Use the `authService` or create new services in `src/services/` for API calls.
- Use the configured Axios instance to ensure base URLs and auth headers are handled automatically.
- Always handle loading and error states in the UI.

### 4. Navigation & Routing
- Use `next/link` for internal navigation.
- Use `useRouter` from `next/navigation` for programmatic redirects.
- Use route groups (e.g., `(dashboard)`) to organize layouts without affecting the URL structure.

## Quality Assurance

- **Linting:** Run `npm run lint` before finalizing any changes.
- **Type Safety:** Avoid using `any`. Define interfaces for API responses and component props.
- **Responsive Design:** Ensure all new features are mobile-first and responsive.

## Key Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint.
