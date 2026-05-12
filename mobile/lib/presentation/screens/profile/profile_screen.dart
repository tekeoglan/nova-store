import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/api_client.dart';
import '../../../core/constants.dart';
import '../../../data/models/order.dart';
import '../../../data/services/order_service.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/nova_button.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  User? _profile;
  List<OrderResponse>? _orders;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _fetchData());
  }

  Future<void> _fetchData() async {
    final auth = ref.read(authProvider);
    if (!auth.isAuthenticated) {
      context.go('/login');
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final results = await Future.wait([
        ApiClient.instance.dio.get('/auth/me'),
        OrderService().getOrders(),
      ]);

      final profileResponse = results[0] as Response;
      final profileJson = profileResponse.data as Map<String, dynamic>;
      final orders = results[1] as List<OrderResponse>;

      setState(() {
        _profile = User.fromJson(profileJson);
        _orders = orders;
        _loading = false;
      });
    } on DioException catch (e) {
      setState(() {
        _error = e.response?.data?['message'] as String? ?? 'Failed to load profile';
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load profile';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);

    if (!auth.isAuthenticated) {
      context.go('/login');
      return const SizedBox.shrink();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline,
                  size: 48, color: AppColors.error),
              const SizedBox(height: 16),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.error, fontSize: 14),
              ),
              const SizedBox(height: 24),
              NovaButton(
                label: 'Try Again',
                onPressed: _fetchData,
              ),
            ],
          ),
        ),
      );
    }

    final orders = _orders ?? [];
    final profile = _profile;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.marginMobile),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (profile != null) _buildUserCard(profile),
          const SizedBox(height: 24),
          _buildOrderHistory(orders),
          const SizedBox(height: 32),
          Center(
            child: NovaButton(
              label: 'Log Out',
              variant: NovaButtonVariant.secondary,
              icon: const Icon(Icons.logout, size: 18),
              padding:
                  const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              onPressed: () => _handleLogout(),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildUserCard(User profile) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceMain,
        borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.person,
              size: 36,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            profile.fullName,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: AppColors.onSurface,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            '@${profile.username}',
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 16),
          _infoRow(Icons.person_outline, 'Full Name', profile.fullName),
          const SizedBox(height: 8),
          _infoRow(Icons.email_outlined, 'Email', profile.email),
          if (profile.city != null) ...[
            const SizedBox(height: 8),
            _infoRow(Icons.location_on_outlined, 'City', profile.city!),
          ],
        ],
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceMuted,
        borderRadius: BorderRadius.circular(AppRadius.sm),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.onSurface,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderHistory(List<OrderResponse> orders) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceMain,
        borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
        border: Border.all(color: AppColors.outlineVariant),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.inventory_2_outlined,
                  size: 22, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(
                'Order History',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.onSurface,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (orders.isEmpty)
            _buildEmptyOrders()
          else
            ...orders.map((order) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _buildOrderCard(order),
                )),
        ],
      ),
    );
  }

  Widget _buildEmptyOrders() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 32),
        child: Column(
          children: [
            const Icon(Icons.shopping_bag_outlined,
                size: 48, color: AppColors.outline),
            const SizedBox(height: 12),
            const Text(
              'No orders yet',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 16),
            NovaButton(
              label: 'Start Shopping',
              onPressed: () => context.go('/'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderCard(OrderResponse order) {
    final date =
        order.orderDate.isNotEmpty ? order.orderDate.split('T')[0] : '';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.outlineVariant),
        borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Order #${order.orderId}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.onSurface,
                    ),
                  ),
                  if (date.isNotEmpty)
                    Text(
                      date,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textSecondary,
                      ),
                    ),
                ],
              ),
              Text(
                '\$${order.totalAmount.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ...order.items.map((item) => Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        item.productName,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.onSurface,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Text(
                      '${item.quantity} x \$${item.price.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  void _handleLogout() {
    ref.read(authProvider.notifier).logout();
    context.go('/');
  }
}
