import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { productsApi } from '../api/products.api';
import Navbar from '../components/Navbar';

const variantSchema = z.object({
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),

  priceOverride: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.number().positive().optional()
  ),
});

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be non-negative'),
  variants: z.array(
    z.object({
      stock: z.number().min(0, 'Stock must be non-negative'),
      color: z.string().optional(),
      size: z.string().optional(),
      material: z.string().optional(),
      priceOverride: z.number().optional(), // Make it optional to match FormData
    })
  ),
});

type FormData = z.infer<typeof schema>; // Infer type FROM schema

interface ApiVariant {
  color?: string;
  size?: string;
  material?: string;
  stock: number;
  priceOverride?: number;
}

interface ApiProductPayload {
  name: string;
  description?: string;
  basePrice: number;
  variants: ApiVariant[];
}

export default function CreateProductPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      basePrice: 0,
      variants: [{ stock: 1, color: '', size: '', material: '', priceOverride: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const transformToApiPayload = (data: FormData): ApiProductPayload => {
    return {
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      variants: data.variants.map((variant) => ({
        color: variant.color || undefined,
        size: variant.size || undefined,
        material: variant.material || undefined,
        stock: variant.stock,
        priceOverride: variant.priceOverride,
      })),
    };
  };

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const payload = transformToApiPayload(data);
      const product = await productsApi.create(payload);
      navigate(`/products/${product.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setServerError(
        Array.isArray(msg)
          ? msg.join(', ')
          : msg ?? 'Failed to create product',
      );
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
      hasError ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to products
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-6">
          Create Product
        </h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product name *
              </label>
              <input
                {...register('name')}
                placeholder="e.g. Classic T-Shirt"
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Product description..."
                className={`${inputClass()} resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register('basePrice', { valueAsNumber: true })} // ✅ FIXED
                placeholder="19.99"
                className={`${inputClass(!!errors.basePrice)} max-w-[200px]`}
              />
              {errors.basePrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.basePrice.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">
                  Variants
                </h2>
                <button
                  type="button"
                  onClick={() => append({ stock: 1, color: '', size: '', material: '', priceOverride: undefined })}
                  className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  + Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Variant {i + 1}
                      </span>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          className="text-xs text-red-500 hover:text-red-700 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Color
                        </label>
                        <input
                          {...register(`variants.${i}.color`)}
                          placeholder="e.g. red"
                          className={inputClass()}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Size
                        </label>
                        <input
                          {...register(`variants.${i}.size`)}
                          placeholder="e.g. M"
                          className={inputClass()}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Material
                        </label>
                        <input
                          {...register(`variants.${i}.material`)}
                          placeholder="e.g. cotton"
                          className={inputClass()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Stock *
                        </label>
                        <input
                          type="number"
                          min="0"
                          {...register(`variants.${i}.stock`, { valueAsNumber: true })} // ✅ FIXED
                          className={inputClass(
                            !!errors.variants?.[i]?.stock,
                          )}
                        />
                        {errors.variants?.[i]?.stock && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.variants[i]?.stock?.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Price override ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          {...register(`variants.${i}.priceOverride`, { valueAsNumber: true })} // ✅ FIXED
                          className={inputClass()}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.variants && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.variants.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 rounded-xl text-white font-semibold
                text-sm transition
                ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-700'
                }
              `}
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}