class Product {
  final String id;
  final String name;
  final String category;
  final double price;
  final double? oldPrice;
  final double rating;
  final int reviews;
  final String image;
  final bool isSale;

  Product({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    this.oldPrice,
    required this.rating,
    required this.reviews,
    required this.image,
    this.isSale = false,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      oldPrice: (json['oldPrice'] as num?)?.toDouble(),
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviews: json['reviews'] as int? ?? 0,
      image: json['image'] as String? ?? '',
      isSale: json['isSale'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'category': category,
        'price': price,
        'oldPrice': oldPrice,
        'rating': rating,
        'reviews': reviews,
        'image': image,
        'isSale': isSale,
      };
}

class ProductDetail extends Product {
  final List<String> breadcrumb;
  final String description;
  final List<ColorOption> colors;
  final List<String> images;
  final List<ProductFeature> features;
  final Map<String, String> specs;
  final List<RelatedProduct> relatedProducts;

  ProductDetail({
    required super.id,
    required super.name,
    required super.category,
    required super.price,
    super.oldPrice,
    required super.rating,
    required super.reviews,
    required super.image,
    super.isSale,
    this.breadcrumb = const [],
    this.description = '',
    this.colors = const [],
    this.images = const [],
    this.features = const [],
    this.specs = const {},
    this.relatedProducts = const [],
  });

  factory ProductDetail.fromJson(Map<String, dynamic> json) {
    return ProductDetail(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      oldPrice: (json['oldPrice'] as num?)?.toDouble(),
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviews: json['reviews'] as int? ?? 0,
      image: json['image'] as String? ?? '',
      isSale: json['isSale'] as bool? ?? false,
      breadcrumb: (json['breadcrumb'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      description: json['description'] as String? ?? '',
      colors: (json['colors'] as List<dynamic>?)
              ?.map((e) => ColorOption.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      images: (json['images'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      features: (json['features'] as List<dynamic>?)
              ?.map((e) => ProductFeature.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      specs: (json['specs'] as Map<String, dynamic>?)
              ?.map((k, v) => MapEntry(k, v.toString())) ??
          {},
      relatedProducts: (json['relatedProducts'] as List<dynamic>?)
              ?.map(
                  (e) => RelatedProduct.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class ColorOption {
  final String name;
  final String value;

  ColorOption({required this.name, required this.value});

  factory ColorOption.fromJson(Map<String, dynamic> json) {
    return ColorOption(
      name: json['name'] as String? ?? '',
      value: json['value'] as String? ?? '',
    );
  }
}

class ProductFeature {
  final String icon;
  final String title;
  final String description;

  ProductFeature({
    required this.icon,
    required this.title,
    required this.description,
  });

  factory ProductFeature.fromJson(Map<String, dynamic> json) {
    return ProductFeature(
      icon: json['icon'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
    );
  }
}

class RelatedProduct {
  final String id;
  final String name;
  final String category;
  final double price;
  final String image;

  RelatedProduct({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.image,
  });

  factory RelatedProduct.fromJson(Map<String, dynamic> json) {
    return RelatedProduct(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      image: json['image'] as String? ?? '',
    );
  }
}
