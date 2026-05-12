import 'package:dio/dio.dart';
import '../../core/api_client.dart';
import '../models/product.dart';

class ProductService {
  final Dio _dio;

  ProductService() : _dio = ApiClient.instance.dio;

  Future<List<Product>> getProducts({
    String? category,
    double? minPrice,
    double? maxPrice,
    String? search,
  }) async {
    final params = <String, dynamic>{};
    if (search != null && search.isNotEmpty) params['search'] = search;
    if (category != null && category.isNotEmpty) params['category'] = category;
    if (minPrice != null) params['minPrice'] = minPrice;
    if (maxPrice != null) params['maxPrice'] = maxPrice;

    final response = await _dio.get(
      '/products',
      queryParameters: params.isNotEmpty ? params : null,
    );

    final List<dynamic> data = response.data as List<dynamic>;
    return data
        .map((json) => Product.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<ProductDetail> getProductById(String id) async {
    final response = await _dio.get('/products/$id');
    return ProductDetail.fromJson(response.data as Map<String, dynamic>);
  }
}
