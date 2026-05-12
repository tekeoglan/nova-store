import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';
import 'core/api_client.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  ApiClient.instance.init(
    baseUrl: const String.fromEnvironment(
      'BACKEND_URL',
      defaultValue: 'http://localhost:8080/api',
    ),
  );

  runApp(
    const ProviderScope(
      child: NovaStoreApp(),
    ),
  );
}
