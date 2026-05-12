import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/api_client.dart';

class User {
  final int userId;
  final String username;
  final String fullName;
  final String email;
  final int? customerId;
  final String? city;

  User({
    required this.userId,
    required this.username,
    required this.fullName,
    required this.email,
    this.customerId,
    this.city,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['userId'] as int? ?? 0,
      username: json['username'] as String? ?? '',
      fullName: json['fullName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      customerId: json['customerId'] as int?,
      city: json['city'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'username': username,
        'fullName': fullName,
        'email': email,
        'customerId': customerId,
        'city': city,
      };
}

class AuthState {
  final User? user;
  final String? token;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.token,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    String? token,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState());

  Future<void> tryAutoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    final userJson = prefs.getString('auth_user');

    if (token != null && userJson != null) {
      final userMap = jsonDecode(userJson) as Map<String, dynamic>;
      final user = User.fromJson(userMap);
      await _applyAuth(token, user);
    }
  }

  Future<void> login(String username, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await ApiClient.instance.dio.post('/auth/login', data: {
        'username': username,
        'password': password,
      });

      final token = response.data['token'] as String;
      final userResponse =
          await ApiClient.instance.dio.get('/auth/me', options: Options(
        headers: {'Authorization': 'Bearer $token'},
      ));
      final user = User.fromJson(userResponse.data as Map<String, dynamic>);
      await _applyAuth(token, user);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] as String? ??
          'Invalid username or password';
      state = state.copyWith(isLoading: false, error: msg);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Login failed');
    }
  }

  Future<void> signup({
    required String username,
    required String password,
    required String fullName,
    required String email,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await ApiClient.instance.dio.post('/auth/signup', data: {
        'username': username,
        'password': password,
        'fullName': fullName,
        'email': email,
      });
      await login(username, password);
    } on DioException catch (e) {
      final msg = e.response?.data?['message'] as String? ??
          'Registration failed';
      state = state.copyWith(isLoading: false, error: msg);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Registration failed');
    }
  }

  Future<void> _applyAuth(String token, User user) async {
    ApiClient.instance.setAuthToken(token);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    await prefs.setString('auth_user', jsonEncode(user.toJson()));
    state = AuthState(
      user: user,
      token: token,
      isAuthenticated: true,
    );
  }

  Future<void> logout() async {
    ApiClient.instance.setAuthToken(null);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('auth_user');
    state = const AuthState();
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
