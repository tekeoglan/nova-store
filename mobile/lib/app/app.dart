import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../presentation/providers/auth_provider.dart';
import '../presentation/providers/cart_provider.dart';
import 'router.dart';
import 'theme.dart';

class NovaStoreApp extends StatelessWidget {
  const NovaStoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'NovaStore',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      routerConfig: appRouter,
      builder: (context, child) {
        return _AppStartup(child: child!);
      },
    );
  }
}

class _AppStartup extends ConsumerStatefulWidget {
  final Widget child;
  const _AppStartup({required this.child});

  @override
  ConsumerState<_AppStartup> createState() => _AppStartupState();
}

class _AppStartupState extends ConsumerState<_AppStartup> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(authProvider.notifier).tryAutoLogin();
      ref.read(cartProvider.notifier).loadFromPrefs();
    });
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
