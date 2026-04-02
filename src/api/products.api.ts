import client from './client';

export interface Variant {
  id: string;
  color: string | null;
  size: string | null;
  material: string | null;
  combinationKey: string;
  stock: number;
  priceOverride: number | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  variants: Variant[];
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  createdAt: string;
  length: number;
}

export interface CreateVariantInput {
  color?: string;
  size?: string;
  material?: string;
  stock: number;
  priceOverride?: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  basePrice: number;
  variants: CreateVariantInput[];
  images?: File[];
}

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await client.get('/products');
    return res.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const res = await client.get(`/products/${id}`);
    return res.data;
  },

  create: async (data: CreateProductInput): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('basePrice', data.basePrice.toString());
    formData.append('variants', JSON.stringify(data.variants));
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const res = await client.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<CreateProductInput>,
  ): Promise<Product> => {
    const res = await client.put(`/products/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await client.delete(`/products/${id}`);
    return res.data;
  },

  addVariant: async (
    productId: string,
    data: CreateVariantInput,
  ): Promise<Variant> => {
    const res = await client.post(`/products/${productId}/variants`, data);
    return res.data;
  },

  updateStock: async (
    productId: string,
    variantId: string,
    stock: number,
  ): Promise<Variant> => {
    const res = await client.patch(
      `/products/${productId}/variants/${variantId}/stock`,
      { stock },
    );
    return res.data;
  },
};