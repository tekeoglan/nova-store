import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants.dart';
import '../../../data/models/product.dart';
import '../../../data/services/product_service.dart';
import '../../providers/cart_provider.dart';
import '../../widgets/nova_button.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailScreen({super.key, required this.productId});

  @override
  ConsumerState<ProductDetailScreen> createState() =>
      _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen> {
  ProductDetail? _product;
  bool _loading = true;
  String? _error;
  int _activeImage = 0;
  int _selectedColorIndex = 0;
  int _quantity = 1;

  @override
  void initState() {
    super.initState();
    _fetchProduct();
  }

  Future<void> _fetchProduct() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final product =
          await ProductService().getProductById(widget.productId);
      setState(() {
        _product = product;
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load product';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border),
            color: AppColors.onSurface,
            onPressed: () {},
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_loading) return _buildShimmer();
    if (_error != null || _product == null) return _buildError();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildImageGallery(),
          Padding(
            padding: const EdgeInsets.fromLTRB(
                AppSpacing.marginMobile, 16, AppSpacing.marginMobile, 0),
            child: _buildProductInfo(),
          ),
          const SizedBox(height: 24),
          _buildFeaturesSection(),
          const SizedBox(height: 24),
          _buildSpecsSection(),
          const SizedBox(height: 24),
          if (_product!.relatedProducts.isNotEmpty)
            _buildRelatedProducts(),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildShimmer() {
    return SingleChildScrollView(
      child: Column(
        children: [
          AspectRatio(
            aspectRatio: 1,
            child: Container(color: AppColors.surfaceMuted),
          ),
          Padding(
            padding: const EdgeInsets.all(AppSpacing.marginMobile),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                    height: 14, width: 200, color: AppColors.surfaceMuted),
                const SizedBox(height: 12),
                Container(
                    height: 22, width: 280, color: AppColors.surfaceMuted),
                const SizedBox(height: 8),
                Container(
                    height: 14, width: 100, color: AppColors.surfaceMuted),
                const SizedBox(height: 16),
                Container(
                    height: 32, width: 120, color: AppColors.surfaceMuted),
                const SizedBox(height: 16),
                Container(
                    height: 60, width: double.infinity,
                    color: AppColors.surfaceMuted),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppColors.error),
            const SizedBox(height: 16),
            Text(
              'Product Not Found',
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                    color: AppColors.onSurface,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              _error ?? 'The product you are looking for does not exist.',
              style: Theme.of(context)
                  .textTheme
                  .bodyMedium
                  ?.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            NovaButton(
              label: 'Back to Home',
              onPressed: () => context.go('/'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageGallery() {
    final product = _product!;
    final images = product.images.isNotEmpty ? product.images : [product.image];
    final displayImage = images[_activeImage.clamp(0, images.length - 1)];

    return Column(
      children: [
        AspectRatio(
          aspectRatio: 1,
          child: CachedNetworkImage(
            imageUrl: displayImage,
            fit: BoxFit.cover,
            placeholder: (context, url) => Container(
              color: AppColors.surfaceMuted,
            ),
            errorWidget: (context, url, error) => Container(
              color: AppColors.surfaceMuted,
              child: const Icon(Icons.image_outlined,
                  size: 48, color: AppColors.outline),
            ),
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 64,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: images.length < 4 ? images.length + 1 : images.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              if (index >= images.length) {
                return Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceMuted,
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                    border: Border.all(color: AppColors.outlineVariant),
                  ),
                  child: const Icon(Icons.play_arrow,
                      size: 28, color: AppColors.outline),
                );
              }
              final isActive = index == _activeImage;
              return GestureDetector(
                onTap: () => setState(() => _activeImage = index),
                child: Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(AppRadius.sm),
                    border: Border.all(
                      color: isActive ? AppColors.primary : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(AppRadius.sm - 2),
                    child: CachedNetworkImage(
                      imageUrl: images[index],
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: AppColors.surfaceMuted,
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: AppColors.surfaceMuted,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildProductInfo() {
    final product = _product!;
    final selectedColor = product.colors.isNotEmpty
        ? product.colors[_selectedColorIndex.clamp(0, product.colors.length - 1)]
        : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildBreadcrumb(product),
        const SizedBox(height: 12),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Text(
                product.name,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: AppColors.onSurface,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            RatingBar.builder(
              initialRating: product.rating,
              minRating: 0,
              direction: Axis.horizontal,
              allowHalfRating: true,
              itemCount: 5,
              itemSize: 16,
              ignoreGestures: true,
              itemBuilder: (context, _) => const Icon(
                Icons.star,
                color: Color(0xFFFBBF24),
              ),
              onRatingUpdate: (_) {},
            ),
            const SizedBox(width: 6),
            Text(
              '(${product.reviews} reviews)',
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '\$${product.price.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: AppColors.onSurface,
              ),
            ),
            if (product.oldPrice != null) ...[
              const SizedBox(width: 8),
              Padding(
                padding: const EdgeInsets.only(bottom: 2),
                child: Text(
                  '\$${product.oldPrice!.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 14,
                    decoration: TextDecoration.lineThrough,
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            const Icon(Icons.shield, size: 16, color: AppColors.statusSuccess),
            const SizedBox(width: 4),
            const Text(
              'In Stock & Ready to Ship',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.statusSuccess,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Text(
          product.description,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
            height: 1.5,
          ),
        ),
        if (product.colors.isNotEmpty) ...[
          const SizedBox(height: 20),
          Text(
            'Color: ${selectedColor?.name ?? ""}',
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.onSurface,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: List.generate(product.colors.length, (index) {
              final color = product.colors[index];
              final isSelected = index == _selectedColorIndex;
              return GestureDetector(
                onTap: () => setState(() => _selectedColorIndex = index),
                child: Container(
                  width: 32,
                  height: 32,
                  margin: const EdgeInsets.only(right: 10),
                  decoration: BoxDecoration(
                    color: _parseColor(color.value),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color:
                          isSelected ? AppColors.primary : Colors.transparent,
                      width: 2,
                    ),
                  ),
                  child: isSelected
                      ? const Center(
                          child: Icon(Icons.check,
                              size: 16, color: Colors.white))
                      : null,
                ),
              );
            }),
          ),
        ],
        const SizedBox(height: 20),
        Row(
          children: [
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.outline),
                borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
              ),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => setState(
                        () => _quantity = (_quantity - 1).clamp(1, 999)),
                    child: const Padding(
                      padding: EdgeInsets.all(10),
                      child: Icon(Icons.remove, size: 18),
                    ),
                  ),
                  SizedBox(
                    width: 36,
                    child: Center(
                      child: Text(
                        '$_quantity',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () =>
                        setState(() => _quantity = (_quantity + 1).clamp(1, 999)),
                    child: const Padding(
                      padding: EdgeInsets.all(10),
                      child: Icon(Icons.add, size: 18),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: NovaButton(
                label: 'Add to Cart',
                onPressed: _handleAddToCart,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.surfaceMuted,
            borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  const Icon(Icons.local_shipping_outlined,
                      size: 18, color: AppColors.outline),
                  const SizedBox(width: 10),
                  const Text(
                    'Free expedited shipping on orders over \$100',
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(Icons.shield_outlined,
                      size: 18, color: AppColors.outline),
                  const SizedBox(width: 10),
                  const Text(
                    '2-year comprehensive global warranty',
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBreadcrumb(ProductDetail product) {
    final items = product.breadcrumb.isNotEmpty
        ? product.breadcrumb
        : ['Home', product.category, product.name];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: List.generate(items.length, (index) {
          final isLast = index == items.length - 1;
          return Row(
            children: [
              Text(
                items[index],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isLast ? FontWeight.w600 : FontWeight.w400,
                  color: isLast
                      ? AppColors.onSurface
                      : AppColors.textSecondary,
                ),
              ),
              if (!isLast) ...[
                const SizedBox(width: 4),
                Text(
                  '>',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(width: 4),
              ],
            ],
          );
        }),
      ),
    );
  }

  Widget _buildFeaturesSection() {
    final features = _product!.features;
    if (features.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.marginMobile),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Why You'll Love It",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.onSurface,
            ),
          ),
          const SizedBox(height: 16),
          ...features.map((f) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.star,
                          size: 20, color: AppColors.primary),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            f.title,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppColors.onSurface,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            f.description,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppColors.textSecondary,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildSpecsSection() {
    final specs = _product!.specs;
    if (specs.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.marginMobile),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.surfaceMuted,
          borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Technical Specifications',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.onSurface,
              ),
            ),
            const SizedBox(height: 16),
            ...specs.entries.map((entry) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        entry.key,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      Text(
                        entry.value,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.onSurface,
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildRelatedProducts() {
    final related = _product!.relatedProducts;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.marginMobile),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Complete Your Setup',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.onSurface,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 200,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: related.length,
              separatorBuilder: (_, _) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final r = related[index];
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _activeImage = 0;
                      _selectedColorIndex = 0;
                      _quantity = 1;
                    });
                    context.pushReplacement('/product/${r.id}');
                  },
                  child: SizedBox(
                    width: 140,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius:
                              BorderRadius.circular(AppRadius.defaultRadius),
                          child: SizedBox(
                            width: 140,
                            height: 140,
                            child: CachedNetworkImage(
                              imageUrl: r.image,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => Container(
                                color: AppColors.surfaceMuted,
                              ),
                              errorWidget: (context, url, error) =>
                                  Container(
                                color: AppColors.surfaceMuted,
                                child: const Icon(Icons.image_outlined,
                                    color: AppColors.outline),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          r.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.onSurface,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '\$${r.price.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _handleAddToCart() {
    final product = _product!;
    final cartNotifier = ref.read(cartProvider.notifier);

    for (int i = 0; i < _quantity; i++) {
      cartNotifier.addProduct(product);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$_quantity x ${product.name} added to cart'),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
        action: SnackBarAction(
          label: 'View Cart',
          onPressed: () => context.push('/cart'),
        ),
      ),
    );
  }

  Color _parseColor(String hex) {
    hex = hex.replaceAll('#', '');
    if (hex.length == 6) hex = 'FF$hex';
    return Color(int.parse(hex, radix: 16));
  }
}
