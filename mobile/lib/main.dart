import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app/app.dart';
import 'core/api_client.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  ApiClient.instance.init(
    baseUrl: const String.fromEnvironment(
      'BACKEND_URL',
      defaultValue: 'http://localhost:8080/api',
    ),
  );

  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('auth_token');
  if (token != null) {
    ApiClient.instance.setAuthToken(token);
  }

  runApp(
    const ProviderScope(
      child: NovaStoreApp(),
    ),
  );
}
