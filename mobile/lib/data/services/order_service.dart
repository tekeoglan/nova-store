import 'package:dio/dio.dart';
import '../../core/api_client.dart';
import '../models/order.dart';

class OrderService {
  final Dio _dio;

  OrderService() : _dio = ApiClient.instance.dio;

  Future<OrderResponse> createOrder(List<CreateOrderItem> items) async {
    final response = await _dio.post('/orders', data: {
      'items': items.map((i) => i.toJson()).toList(),
    });
    return OrderResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<List<OrderResponse>> getOrders() async {
    final response = await _dio.get('/orders');
    final List<dynamic> data = response.data as List<dynamic>;
    return data
        .map((json) => OrderResponse.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
