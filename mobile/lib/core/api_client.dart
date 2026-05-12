import 'package:dio/dio.dart';

const String _defaultBaseUrl = 'http://localhost:8080/api';

class ApiClient {
  ApiClient._internal();

  static final ApiClient _instance = ApiClient._internal();
  static ApiClient get instance => _instance;

  late final Dio dio;
  String? _authToken;

  void setAuthToken(String? token) {
    _authToken = token;
  }

  void init({String? baseUrl}) {
    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl ?? _defaultBaseUrl,
        contentType: 'application/json',
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
      ),
    );

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        if (_authToken != null) {
          options.headers['Authorization'] = 'Bearer $_authToken';
        }
        handler.next(options);
      },
    ));
  }
}
