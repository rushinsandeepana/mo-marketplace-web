import { useState } from 'react';
import { type Variant } from '../api/products.api';
import { cartStore } from '../store/cart.store';

interface Props {
  productId: string;
  selectedVariant: Variant | null;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  imageUrl?: string;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
}

export default function QuickBuy({
  productId,
  selectedVariant,
  productName,
  price,
  quantity,
  totalAmount,
  imageUrl,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock < quantity) return;

    cartStore.addItem({
      productId,
      productName,
      variantId: selectedVariant.id,
      variantKey: selectedVariant.combinationKey,
      price,
      quantity,
      imageUrl,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isDisabled =
    !selectedVariant ||
    selectedVariant.stock === 0 ||
    quantity > selectedVariant.stock;

  return (
    <div className="mt-6">
      {selectedVariant && selectedVariant.stock > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={onDecreaseQuantity}
              disabled={quantity <= 1}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center
                justify-center hover:bg-gray-50 disabled:opacity-50
                disabled:cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <span className="text-xl font-semibold text-gray-900 min-w-[40px] text-center">
              {quantity}
            </span>

            <button
              onClick={onIncreaseQuantity}
              disabled={quantity >= selectedVariant.stock}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center
                justify-center hover:bg-gray-50 disabled:opacity-50
                disabled:cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            <span className="text-sm text-gray-500">
              {selectedVariant.stock} available
            </span>
          </div>
        </div>
      )}

      {selectedVariant && (
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Unit price</span>
            <span className="text-gray-900 font-medium">${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quantity</span>
            <span className="text-gray-900 font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`w-full py-3 px-8 rounded-xl text-white font-semibold text-base transition
          ${isDisabled
            ? 'bg-gray-300 cursor-not-allowed'
            : added
            ? 'bg-green-600'
            : 'bg-gray-900 hover:bg-gray-700'
          }`}
      >
        {!selectedVariant
          ? 'Select a variant first'
          : selectedVariant.stock === 0
          ? 'Out of stock'
          : quantity > selectedVariant.stock
          ? 'Not enough stock'
          : added
          ? '✓ Added to cart'
          : `Add to cart — $${totalAmount.toFixed(2)}`}
      </button>
    </div>
  );
}