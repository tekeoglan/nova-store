import 'package:dio/dio.dart';
import '../models/product.dart';
import '../services/product_service.dart';

class ProductRepository {
  final ProductService _service;

  ProductRepository({ProductService? service})
      : _service = service ?? ProductService();

  Future<List<Product>> getProducts({
    String? category,
    double? minPrice,
    double? maxPrice,
    String? search,
  }) async {
    try {
      return await _service.getProducts(
        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        search: search,
      );
    } on DioException {
      rethrow;
    }
  }
}
