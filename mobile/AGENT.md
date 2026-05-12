# AGENT.md — NovaStore Mobile (Flutter)

This document provides guidance for AI agents working on the NovaStore mobile application.

## Tech Stack

- **Framework:** Flutter (SDK ^3.11.5)
- **Language:** Dart
- **State Management:** Riverpod (`flutter_riverpod`) — `StateNotifierProvider` + `FutureProvider`
- **HTTP Client:** Dio (`dio`)
- **Routing:** GoRouter (`go_router`)
- **Fonts:** Manrope via `google_fonts`
- **Image Loading:** `cached_network_image`
- **Rating Display:** `flutter_rating_bar`
- **Loading Skeletons:** `shimmer`
- **Persistence:** `shared_preferences`

## Project Structure

```
mobile/lib/
├── main.dart                         # Entry point: init ApiClient, run ProviderScope + NovaStoreApp
├── app/
│   ├── app.dart                      # MaterialApp.router with theme + routerConfig
│   ├── router.dart                   # GoRouter route definitions
│   └── theme.dart                    # ThemeData from design system (AppTheme.light)
├── core/
│   ├── api_client.dart               # Dio singleton, baseUrl from --dart-define BACKEND_URL
│   └── constants.dart                # Design tokens: AppColors, AppRadius, AppSpacing
├── data/
│   ├── models/
│   │   ├── product.dart              # Product, ProductDetail, ColorOption, etc. with fromJson
│   │   └── order.dart                # OrderResponse, OrderItem, CreateOrderItem with fromJson
│   ├── services/
│   │   ├── product_service.dart      # ProductService: getProducts(), getProductById()
│   │   └── order_service.dart        # OrderService: createOrder(), getOrders()
│   └── repositories/
│       └── product_repository.dart   # Thin wrapper around service, rethrows DioException
└── presentation/
    ├── providers/
    │   ├── filter_provider.dart      # FilterNotifier: category, priceRange, sortBy, searchQuery
    │   │                             #   + productsProvider: auto-refetches on filter change
    │   ├── cart_provider.dart        # CartNotifier: items, addItem, removeItem, updateQuantity
    │   │                             #   auto-persisted to SharedPreferences
    │   └── auth_provider.dart        # AuthNotifier: login, signup, logout, token persist
    ├── screens/
    │   ├── home/
    │   │   └── home_screen.dart      # CustomScrollView + cart badge in AppBar
    │   ├── cart/
    │   │   └── cart_screen.dart      # Item list, quantity steppers, order summary,
    │   │                             #   checkout flow with auth gate + success view
    │   ├── login/
    │   │   └── login_screen.dart     # Username/password form, auto-pop on auth
    │   ├── signup/
    │   │   └── signup_screen.dart    # Full registration form with validation
    │   └── profile/
    │       └── profile_screen.dart   # User info card + order history + logout
    └── widgets/
        ├── hero_banner.dart          # Gradient overlay, "NEW ARRIVAL" badge, title, description,
        │                             #   "Shop Collection" button pinned to bottom
        ├── category_chips.dart       # Horizontal scrollable chips: All, Elektronik, Giyim, ...
        ├── price_range_selector.dart # Horizontal chips: All Prices, Under 500, 500-2000, ...
        ├── product_grid.dart         # 2-column SliverGrid + shimmer loading + error state
        ├── product_card.dart         # Image (1:1), Sale badge, name (2 lines), stars, price,
        │                             #   "Add to cart" icon button
        └── nova_button.dart          # Reusable: primary/secondary/outline/ghost variants
```

## Development Guidelines

### 1. Widget Patterns
- Use `ConsumerWidget` (Riverpod) for any widget that reads providers.
- Use `StatelessWidget` for pure presentation widgets.
- Name files in `snake_case.dart`.
- Always prefer existing widgets in `presentation/widgets/` before creating new ones.

### 2. State Management (Riverpod)
- **Filter state:** `filterProvider` — `StateNotifierProvider<FilterNotifier, FilterState>` with category, priceRange (enum), sortBy (enum), searchQuery.
- **Products data:** `productsProvider` — `FutureProvider` that watches filterProvider and calls repository. Auto-refetches on filter change. Sorting is done client-side after fetch.
- **Cart state:** `cartProvider` — `StateNotifierProvider<CartNotifier, List<CartItem>>` with add/remove/updateQuantity/totalItems/totalPrice. Auto-persisted to `SharedPreferences` under `cart_items` key.
- **Auth state:** `authProvider` — `StateNotifierProvider<AuthNotifier, AuthState>` with user, token, isAuthenticated, isLoading, error. Persisted to `SharedPreferences` under `auth_token` and `auth_user`.
- **Reading providers:**
  ```dart
  final filter = ref.watch(filterProvider);                     // reactive rebuild
  final productsAsync = ref.watch(productsProvider);            // reactive rebuild
  final notifier = ref.read(cartProvider.notifier);             // one-time action
  final auth = ref.watch(authProvider);                         // reactive rebuild
  ```
- **Writing providers:**
  ```dart
  ref.read(filterProvider.notifier).setCategory('Elektronik');
  ref.read(cartProvider.notifier).addProduct(product);
  ref.read(cartProvider.notifier).removeItem(id);
  ref.read(cartProvider.notifier).updateQuantity(id, 3);
  ref.read(cartProvider.notifier).clearCart();
  ref.read(authProvider.notifier).login('username', 'password');
  ref.read(authProvider.notifier).signup(username:, password:, fullName:, email:);
  ref.read(authProvider.notifier).logout();
  ```

### 3. API Communication
- Use `ApiClient.instance.dio` for HTTP calls (already configured in `product_service.dart` and `order_service.dart`).
- The base URL is set at startup via `--dart-define=BACKEND_URL=...` (default: `http://localhost:8080/api`).
- For Android emulator, use `http://10.0.2.2:8080/api` (maps to host localhost).
- **Auth interceptor:** `ApiClient` automatically attaches `Authorization: Bearer <token>` header to every request when a token is set via `ApiClient.instance.setAuthToken(token)`. This is called automatically on login and app startup.
- Always handle loading/error states using `.when(loading:, error:, data:)` on `AsyncValue`.

**Product Service Usage:**
```dart
final service = ProductService();
final products = await service.getProducts(
  category: 'Elektronik',
  minPrice: 500,
  maxPrice: 2000,
  search: 'telefon',
);
final detail = await service.getProductById('1');
```

**Order Service Usage:**
```dart
final service = OrderService();
final order = await service.createOrder([
  CreateOrderItem(productId: '1', quantity: 2),
  CreateOrderItem(productId: '3', quantity: 1),
]);
final orders = await service.getOrders(); // requires auth
```

**Filter Enums:**
```dart
PriceRange.values: all | range0to500 | range500to2000 | range2000to10000 | range10000plus
SortBy.values:    recommended | priceLowToHigh | priceHighToLow | popularity
```

### 4. Model Conventions
- All models use `factory ModelName.fromJson(Map<String, dynamic> json)` constructors.
- `Product` fields mirror backend API response: `id`, `name`, `category`, `price`, `oldPrice`, `rating`, `reviews`, `image`, `isSale`.
- `ProductDetail` extends `Product` with `description`, `colors`, `images`, `features`, `specs`, `relatedProducts`.

### 5. Navigation & Routing
- Use `GoRouter` (defined in `app/router.dart`) for routing.
- Push routes via `context.push('/product/$id')` or `context.go('/cart')`.
- Keep route paths consistent with backend entity names.
- Current routes: `/` (home), `/cart`, `/login`, `/signup`, `/profile`.
- Cart button in the AppBar navigates to `/cart` — wired with a badge showing `totalItems()` count.
- Profile icon in the AppBar navigates to `/profile`.

### 6. Auth & Checkout Flow
- **Login flow:** LoginScreen collects username/password → calls `authProvider.login()` → on success, `AuthNotifier` calls `POST /api/auth/login` + `GET /api/auth/me`, stores token + user in `SharedPreferences`, sets token on `ApiClient` interceptor → screen auto-pops back.
- **Signup flow:** SignupScreen collects fullName/email/username/password → validates client-side → calls `authProvider.signup()` → `POST /api/auth/signup` + auto-login.
- **Checkout flow:** CartScreen → "Proceed to Checkout" checks `auth.isAuthenticated` → if false, pushes `/login` → if true, calls `POST /api/orders` with `[{productId, quantity}]` → on success: `clearCart()` + shows success view → on error: shows error banner.
- **Auto-restore:** On app startup, `_AppStartup` widget calls `tryAutoLogin()` and `loadFromPrefs()` to restore auth session and cart from `SharedPreferences`.
- **Profile flow:** ProfileScreen checks `auth.isAuthenticated` → if false, redirects to `/login` → fetches profile (`GET /api/auth/me`) and orders (`GET /api/orders`) in parallel via `Future.wait` → displays user card (avatar, fullName, email, optional city) and order history cards (order #, date, total, items list) → "Log Out" calls `authProvider.logout()` and redirects to `/`.
- **Token expiry:** Backend JWT expires in 1h. On 401, user must re-login. No refresh token flow.

### 7. Styling (Design System)
- **Do NOT** hardcode colors, radii, or spacing — use constants from `core/constants.dart`:
  ```dart
  AppColors.primary      // #003EC7
  AppColors.onSurface    // #191B25
  AppColors.accentEnergy // #FF6B00
  AppColors.surfaceMuted // #F4F5F7
  AppColors.statusSuccess // #00875A
  AppRadius.defaultRadius // 8.0
  AppRadius.lg           // 16.0
  AppSpacing.md          // 16.0
  AppSpacing.lg          // 24.0
  ```
- Use `Theme.of(context).textTheme.*` for typography (pre-configured with Manrope via `AppTheme.light`).
- Use `NovaButton` with variant enum instead of raw `ElevatedButton`/`OutlinedButton`.
- Cart screen uses hardcoded shipping (`$12.50`) and tax (`8%`) to match the web frontend.

### 8. Icons
- Use Material Icons (`Icons.*`) from `Icons` class (e.g., `Icons.shopping_cart_outlined`, `Icons.search`, `Icons.person_outline`).

### 9. Refresh / Sync
- The home screen's `productsProvider` is a `FutureProvider` — it automatically refetches when watched filter state changes. No manual refresh needed for filter changes.
- Cart persists automatically to `SharedPreferences` after every mutation. Auth persists token + user to `SharedPreferences` after login and restores on startup.

## Design System Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#003EC7` | Brand color, buttons, selected filters |
| `onPrimary` | `#FFFFFF` | Text on primary backgrounds |
| `onSurface` | `#191B25` | Primary text color |
| `textSecondary` | `#44546F` | Secondary/helper text |
| `surfaceMuted` | `#F4F5F7` | Search bar, inactive chips, shimmer |
| `accentEnergy` | `#FF6B00` | Sale badges, promotional elements |
| `outline` | `#737688` | Borders, dividers |
| `error` | `#BA1A1A` | Error states |

## Key Commands

- `flutter run --dart-define=BACKEND_URL=http://10.0.2.2:8080/api` — Run on emulator
- `flutter run --dart-define=BACKEND_URL=http://localhost:8080/api -d chrome` — Run as web
- `flutter analyze` — Static analysis (must pass 0 issues before PR)
- `flutter test` — Run widget tests
- `flutter build apk --dart-define=BACKEND_URL=<prod-url>` — Production APK

## Quality Assurance

- Run `flutter analyze` before finalizing any changes.
- Avoid `dynamic`. Define proper types for all variables.
- All models must have `fromJson` factories; API responses must be typed.
- Ensure grid layouts don't overflow (test on small screen widths).
- Use `Clip.antiAlias` on containers with border radius + image children.
