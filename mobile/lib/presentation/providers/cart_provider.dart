import 'package:flutter_riverpod/flutter_riverpod.dart';
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
}

class CartNotifier extends StateNotifier<List<CartItem>> {
  CartNotifier() : super([]);

  void addItem(CartItem item) {
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
  }

  void addProduct(Product product) {
    addItem(CartItem.fromProduct(product));
  }

  void removeItem(String id) {
    state = state.where((item) => item.id != id).toList();
  }

  void updateQuantity(String id, int quantity) {
    if (quantity < 1) return;
    state = [
      for (final item in state)
        if (item.id == id) item.copyWith(quantity: quantity)
        else item,
    ];
  }

  void clearCart() => state = [];

  int totalItems() => state.fold(0, (sum, item) => sum + item.quantity);
  double totalPrice() =>
      state.fold(0.0, (sum, item) => sum + item.price * item.quantity);
}

final cartProvider = StateNotifierProvider<CartNotifier, List<CartItem>>((ref) {
  return CartNotifier();
});
