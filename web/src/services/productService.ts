import api from './authService';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  isSale?: boolean;
}

export interface ProductDetail extends Product {
  breadcrumb: string[];
  description: string;
  colors: { name: string; value: string }[];
  images: string[];
  features: { icon: string; title: string; description: string }[];
  specs: Record<string, string>;
  relatedProducts: Pick<Product, 'id' | 'name' | 'category' | 'price' | 'image'>[];
}

export const productService = {
  async getProducts(category?: string): Promise<Product[]> {
    const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    const response = await api.get(url);
    return response.data;
  },

  async getProductById(id: string): Promise<ProductDetail> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};