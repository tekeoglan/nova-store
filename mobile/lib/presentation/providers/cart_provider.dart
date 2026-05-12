import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/models/product.dart';

class CartItem {
  final String id;
  final String name;
  final double price;
  final String image;
  final int quantity;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    this.quantity = 1,
  });

  CartItem copyWith({int? quantity}) {
    return CartItem(
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: quantity ?? this.quantity,
    );
  }

  factory CartItem.fromProduct(Product product, {int quantity = 1}) {
    return CartItem(
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'price': price,
        'image': image,
        'quantity': quantity,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      image: json['image'] as String? ?? '',
      quantity: json['quantity'] as int? ?? 1,
    );
  }
}

class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier() : super([]);

  Future<void> loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('cart_items');
    if (data != null) {
      final list = jsonDecode(data) as List<dynamic>;
      state = list
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList();
    }
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    final data = jsonEncode(state.map((e) => e.toJson()).toList());
    await prefs.setString('cart_items', data);
  }

  Future<void> addItem(CartItem item) async {
    final index = state.indexWhere((i) => i.id == item.id);
    if (index >= 0) {
      state = [
        for (int i = 0; i < state.length; i++)
          if (i == index) state[i].copyWith(quantity: state[i].quantity + 1)
          else state[i],
      ];
    } else {
      state = [...state, item];
    }
    _save();
  }

  Future<void> addProduct(Product product) async {
    await addItem(CartItem.fromProduct(product));
  }

  Future<void> removeItem(String id) async {
    state = state.where((item) => item.id != id).toList();
    _save();
  }

  Future<void> updateQuantity(String id, int quantity) async {
    if (quantity < 1) return;
    state = [
      for (final item in state)
        if (item.id == id) item.copyWith(quantity: quantity)
        else item,
    ];
    _save();
  }

  Future<void> clearCart() async {
    state = [];
    _save();
  }

  int totalItems() => state.fold(0, (sum, item) => sum + item.quantity);
  double totalPrice() =>
      state.fold(0.0, (sum, item) => sum + item.price * item.quantity);
}

final cartProvider =
    StateNotifierProvider<CartNotifier, List<CartItem>>((ref) {
  return CartNotifier();
});
