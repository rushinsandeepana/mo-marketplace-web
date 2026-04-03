import client from './client';

interface CreateOrderPayload {
  items: { variantId: string; quantity: number }[];
}

export interface OrderResult {
  orderId: string;
  status: string;
  updatedStocks: Record<string, number>;
}

export const ordersApi = {
  async create(payload: CreateOrderPayload): Promise<OrderResult> {
    const res = await client.post('/orders', payload);
    return res.data;
  },
};