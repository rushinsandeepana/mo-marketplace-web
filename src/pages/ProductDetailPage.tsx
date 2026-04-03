import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/products.api';
import type { Product, Variant } from '../api/products.api';
import Navbar from '../components/Navbar';
import VariantSelector from '../components/VariantSelector';
import QuickBuy from '../components/QuickBuy';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
    productsApi
      .getOne(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onOrderPlaced = (e: Event) => {
      const { updatedStocks } = (e as CustomEvent<{
        updatedStocks: Record<string, number>;
      }>).detail;

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              variants: prev.variants.map((v) =>
                v.id in updatedStocks
                  ? { ...v, stock: updatedStocks[v.id] }
                  : v,
              ),
            }
          : prev,
      );

      setSelectedVariant((prev) =>
        prev && prev.id in updatedStocks
          ? { ...prev, stock: updatedStocks[prev.id] }
          : prev,
      );

      setQuantity(1);
    };

    window.addEventListener('order-placed', onOrderPlaced);
    return () => window.removeEventListener('order-placed', onOrderPlaced);
  }, []);

  const nextImage = () => {
    const len = product?.images?.length;
    if (len) setCurrentImageIndex((prev) => (prev + 1) % len);
  };

  const prevImage = () => {
    const len = product?.images?.length;
    if (len) setCurrentImageIndex((prev) => (prev - 1 + len) % len);
  };

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock)
      setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20 text-red-500">Product not found</div>
      </div>
    );
  }

  const price = selectedVariant?.priceOverride
    ? Number(selectedVariant.priceOverride)
    : Number(product.basePrice);

  const totalAmount = price * quantity;

  const currentImageUrl =
    product.images && product.images.length > 0
      ? `${BASE_URL}${product.images[currentImageIndex].imageUrl}`
      : '/images/no-image.png';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="relative">
              <img
                src={currentImageUrl}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50
                      hover:bg-black/70 text-white rounded-full p-2 transition">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50
                      hover:bg-black/70 text-white rounded-full p-2 transition">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button key={image.id} onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition
                      ${currentImageIndex === index
                        ? 'border-gray-900 ring-2 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-400'}`}>
                    <img
                      src={`${BASE_URL}${image.imageUrl}`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {product.description && (
              <p className="text-gray-500 text-sm mb-4">{product.description}</p>
            )}

            <div className="mb-6">
              <VariantSelector
                variants={product.variants}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>

            <QuickBuy
              productId={product.id}
              imageUrl={product.images?.[0]?.imageUrl}
              selectedVariant={selectedVariant}
              productName={product.name}
              price={price}
              quantity={quantity}
              totalAmount={totalAmount}
              onIncreaseQuantity={increaseQuantity}
              onDecreaseQuantity={decreaseQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}