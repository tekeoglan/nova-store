import 'package:go_router/go_router.dart';
import '../presentation/screens/home/home_screen.dart';
import '../presentation/screens/cart/cart_screen.dart';
import '../presentation/screens/login/login_screen.dart';
import '../presentation/screens/signup/signup_screen.dart';
import '../presentation/screens/profile/profile_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/cart',
      builder: (context, state) => const CartScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/signup',
      builder: (context, state) => const SignupScreen(),
    ),
    GoRoute(
      path: '/profile',
      builder: (context, state) => const ProfileScreen(),
    ),
  ],
);
