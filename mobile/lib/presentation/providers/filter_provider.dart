import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/product.dart';
import '../../data/repositories/product_repository.dart';

enum PriceRange {
  all,
  range0to500,
  range500to2000,
  range2000to10000,
  range10000plus;

  String get label {
    switch (this) {
      case PriceRange.all:
        return 'All Prices';
      case PriceRange.range0to500:
        return 'Under 500';
      case PriceRange.range500to2000:
        return '500 - 2000';
      case PriceRange.range2000to10000:
        return '2000 - 10000';
      case PriceRange.range10000plus:
        return 'Over 10000';
    }
  }

  double? get minPrice {
    switch (this) {
      case PriceRange.all:
        return null;
      case PriceRange.range0to500:
        return 0;
      case PriceRange.range500to2000:
        return 500;
      case PriceRange.range2000to10000:
        return 2000;
      case PriceRange.range10000plus:
        return 10000;
    }
  }

  double? get maxPrice {
    switch (this) {
      case PriceRange.all:
        return null;
      case PriceRange.range0to500:
        return 500;
      case PriceRange.range500to2000:
        return 2000;
      case PriceRange.range2000to10000:
        return 10000;
      case PriceRange.range10000plus:
        return null;
    }
  }
}

enum SortBy {
  recommended,
  priceLowToHigh,
  priceHighToLow,
  popularity;

  String get label {
    switch (this) {
      case SortBy.recommended:
        return 'Recommended';
      case SortBy.priceLowToHigh:
        return 'Price Low to High';
      case SortBy.priceHighToLow:
        return 'Price High to Low';
      case SortBy.popularity:
        return 'Popularity';
    }
  }
}

class FilterState {
  final String category;
  final PriceRange priceRange;
  final SortBy sortBy;
  final String searchQuery;

  const FilterState({
    this.category = 'All',
    this.priceRange = PriceRange.all,
    this.sortBy = SortBy.recommended,
    this.searchQuery = '',
  });

  FilterState copyWith({
    String? category,
    PriceRange? priceRange,
    SortBy? sortBy,
    String? searchQuery,
  }) {
    return FilterState(
      category: category ?? this.category,
      priceRange: priceRange ?? this.priceRange,
      sortBy: sortBy ?? this.sortBy,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }

  bool get hasActiveFilters =>
      category != 'All' ||
      priceRange != PriceRange.all ||
      searchQuery.isNotEmpty;
}

class FilterNotifier extends StateNotifier<FilterState> {
  FilterNotifier() : super(const FilterState());

  void setCategory(String category) => state = state.copyWith(category: category);
  void setPriceRange(PriceRange range) => state = state.copyWith(priceRange: range);
  void setSortBy(SortBy sort) => state = state.copyWith(sortBy: sort);
  void setSearchQuery(String query) => state = state.copyWith(searchQuery: query);
  void resetFilters() => state = const FilterState();
}

final filterProvider =
    StateNotifierProvider<FilterNotifier, FilterState>((ref) {
  return FilterNotifier();
});

final productRepositoryProvider = Provider<ProductRepository>((ref) {
  return ProductRepository();
});

final productsProvider = FutureProvider<List<Product>>((ref) async {
  final filter = ref.watch(filterProvider);
  final repository = ref.watch(productRepositoryProvider);

  final category =
      filter.category == 'All' ? null : filter.category;
  final minPrice = filter.priceRange.minPrice;
  final maxPrice = filter.priceRange.maxPrice;
  final search =
      filter.searchQuery.isNotEmpty ? filter.searchQuery : null;

  final products = await repository.getProducts(
    category: category,
    minPrice: minPrice,
    maxPrice: maxPrice,
    search: search,
  );

  switch (filter.sortBy) {
    case SortBy.priceLowToHigh:
      products.sort((a, b) => a.price.compareTo(b.price));
    case SortBy.priceHighToLow:
      products.sort((a, b) => b.price.compareTo(a.price));
    case SortBy.popularity:
      products.sort((a, b) {
        final rating = b.rating.compareTo(a.rating);
        if (rating != 0) return rating;
        return b.reviews.compareTo(a.reviews);
      });
    case SortBy.recommended:
      break;
  }

  return products;
});
