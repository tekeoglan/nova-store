import api from './authService';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface OrderResponse {
  orderId: number;
  totalAmount: number;
  orderDate: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export const orderService = {
  async createOrder(items: OrderItem[]): Promise<OrderResponse> {
    const response = await api.post('/orders', { items });
    return response.data;
  },
};