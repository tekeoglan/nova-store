import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants.dart';
import '../../providers/auth_provider.dart';
import '../../providers/cart_provider.dart';
import '../../widgets/nova_button.dart';
import '../../../data/services/order_service.dart';
import '../../../data/models/order.dart';

class CartScreen extends ConsumerStatefulWidget {
  const CartScreen({super.key});

  @override
  ConsumerState<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends ConsumerState<CartScreen> {
  bool _checkoutLoading = false;
  String? _checkoutError;
  bool _orderSuccess = false;

  static const double _shipping = 12.50;
  static const double _taxRate = 0.08;

  @override
  Widget build(BuildContext context) {
    final items = ref.watch(cartProvider);
    final auth = ref.watch(authProvider);
    final notifier = ref.read(cartProvider.notifier);

    final subtotal = notifier.totalPrice();
    final tax = subtotal * _taxRate;
    final shipping = items.isNotEmpty ? _shipping : 0.0;
    final total = subtotal + shipping + tax;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping Cart'),
      ),
      body: _orderSuccess
          ? _buildSuccessView(context)
          : items.isEmpty
              ? _buildEmptyView(context)
              : _buildCartContent(context, items, auth, notifier,
                    subtotal, tax, shipping, total),
    );
  }

  Widget _buildEmptyView(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(48),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.surfaceMuted,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.shopping_bag_outlined,
                size: 40,
                color: AppColors.outline,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Your cart is empty',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: AppColors.onSurface,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'Looks like you haven\'t added anything yet.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            NovaButton(
              label: 'Back to Shopping',
              onPressed: () => context.pop(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessView(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(48),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.statusSuccess.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle,
                size: 48,
                color: AppColors.statusSuccess,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Order Placed Successfully!',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: AppColors.onSurface,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'Thank you for your purchase.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.textSecondary,
                  ),
            ),
            const SizedBox(height: 32),
            NovaButton(
              label: 'Continue Shopping',
              onPressed: () => context.go('/'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCartContent(
    BuildContext context,
    List<CartItem> items,
    AuthState auth,
    CartNotifier notifier,
    double subtotal,
    double tax,
    double shipping,
    double total,
  ) {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.marginMobile),
      children: [
        ...items.map((item) => _CartItemTile(
              item: item,
              onIncrement: () => notifier.updateQuantity(item.id, item.quantity + 1),
              onDecrement: () {
                if (item.quantity > 1) {
                  notifier.updateQuantity(item.id, item.quantity - 1);
                }
              },
              onRemove: () => notifier.removeItem(item.id),
            )),
        const SizedBox(height: 24),
        _OrderSummary(
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
        ),
        if (_checkoutError != null)
          Padding(
            padding: const EdgeInsets.only(top: 12),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.errorContainer,
                borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline,
                      size: 16, color: AppColors.onErrorContainer),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _checkoutError!,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.onErrorContainer,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        const SizedBox(height: 16),
        NovaButton(
          label: _checkoutLoading ? 'Processing...' : 'Proceed to Checkout',
          isLoading: _checkoutLoading,
          width: double.infinity,
          onPressed: () => _handleCheckout(auth, items),
        ),
        const SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock_outline, size: 12, color: AppColors.textSecondary),
            const SizedBox(width: 4),
            Text(
              'Secure Checkout',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
            ),
          ],
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Future<void> _handleCheckout(AuthState auth, List<CartItem> items) async {
    if (!auth.isAuthenticated) {
      context.push('/login');
      return;
    }

    setState(() {
      _checkoutLoading = true;
      _checkoutError = null;
    });

    try {
      final orderItems = items
          .map((item) => CreateOrderItem(
                productId: item.id,
                quantity: item.quantity,
              ))
          .toList();

      final service = OrderService();
      await service.createOrder(orderItems);
      await ref.read(cartProvider.notifier).clearCart();
      setState(() {
        _checkoutLoading = false;
        _orderSuccess = true;
      });
    } catch (e) {
      setState(() {
        _checkoutLoading = false;
        _checkoutError = e.toString();
      });
    }
  }
}

class _CartItemTile extends StatelessWidget {
  final CartItem item;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final VoidCallback onRemove;

  const _CartItemTile({
    required this.item,
    required this.onIncrement,
    required this.onDecrement,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceMain,
        borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
        border: Border.all(color: AppColors.surfaceContainerLow),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            child: SizedBox(
              width: 72,
              height: 72,
              child: CachedNetworkImage(
                imageUrl: item.image,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  color: AppColors.surfaceMuted,
                ),
                errorWidget: (context, url, error) => Container(
                  color: AppColors.surfaceMuted,
                  child: const Icon(Icons.image_outlined,
                      size: 24, color: AppColors.outline),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppColors.onSurface,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.outline),
                        borderRadius: BorderRadius.circular(AppRadius.sm),
                      ),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: onDecrement,
                            child: const Padding(
                              padding: EdgeInsets.all(6),
                              child: Icon(Icons.remove, size: 16),
                            ),
                          ),
                          SizedBox(
                            width: 28,
                            child: Center(
                              child: Text(
                                '${item.quantity}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: onIncrement,
                            child: const Padding(
                              padding: EdgeInsets.all(6),
                              child: Icon(Icons.add, size: 16),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '\$${(item.price * item.quantity).toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: AppColors.onSurface,
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: onRemove,
                      child: const Padding(
                        padding: EdgeInsets.all(4),
                        child: Icon(
                          Icons.delete_outline,
                          size: 18,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _OrderSummary extends StatelessWidget {
  final double subtotal;
  final double shipping;
  final double tax;
  final double total;

  const _OrderSummary({
    required this.subtotal,
    required this.shipping,
    required this.tax,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceMain,
        borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Summary',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.onSurface,
                ),
          ),
          const SizedBox(height: 16),
          _summaryRow('Subtotal', '\$${subtotal.toStringAsFixed(2)}'),
          const SizedBox(height: 8),
          _summaryRow('Shipping estimate', '\$${shipping.toStringAsFixed(2)}'),
          const SizedBox(height: 8),
          _summaryRow('Tax estimate', '\$${tax.toStringAsFixed(2)}'),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(height: 1, color: AppColors.outlineVariant),
          ),
          _summaryRow(
            'Total',
            '\$${total.toStringAsFixed(2)}',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? 16 : 13,
            fontWeight: isTotal ? FontWeight.w700 : FontWeight.w400,
            color: isTotal ? AppColors.onSurface : AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isTotal ? 22 : 13,
            fontWeight: FontWeight.w700,
            color: isTotal ? AppColors.primary : AppColors.onSurface,
          ),
        ),
      ],
    );
  }
}
