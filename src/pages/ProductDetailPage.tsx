import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi} from '../api/products.api';
import type { Product } from '../api/products.api';
import type { Variant } from '../api/products.api';
import Navbar from '../components/Navbar';
import VariantSelector from '../components/VariantSelector';
import QuickBuy from '../components/QuickBuy';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productsApi
      .getOne(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-red-500">
          Product not found
        </div>
      </div>
    );
  }

  const price = selectedVariant?.priceOverride
    ? Number(selectedVariant.priceOverride)
    : Number(product.basePrice);

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

        <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-gray-500 text-sm mb-4">
              {product.description}
            </p>
          )}

          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${price.toFixed(2)}
          </p>

          <div className="mb-6">
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </div>

          <QuickBuy
            selectedVariant={selectedVariant}
            productName={product.name}
            price={price}
          />
        </div>
      </div>
    </div>
  );
}