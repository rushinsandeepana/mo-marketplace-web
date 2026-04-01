import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/products.api';
import type { Product } from '../api/products.api';
import Navbar from '../components/Navbar';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productsApi
      .getAll()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);
console.log("products", products);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>
          <Link
            to="/products/new"
            className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            + New Product
          </Link>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading products...
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No products yet</p>
            <Link
              to="/products/new"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
            >
              Create your first product
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => {
            const inStock = product.variants.some((v) => v.stock > 0);
            return (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <p className="text-xl font-bold text-gray-900 mb-3">
                  ${Number(product.basePrice).toFixed(2)}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {product.variants.length} variant
                    {product.variants.length !== 1 ? 's' : ''}
                  </span>
                  <span
                    className={`font-medium ${
                      inStock ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {inStock ? 'In stock' : 'Out of stock'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}