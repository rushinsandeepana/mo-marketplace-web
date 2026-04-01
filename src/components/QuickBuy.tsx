import { useState } from 'react';
import { type Variant } from '../api/products.api';

interface Props {
  selectedVariant: Variant | null;
  productName: string;
  price: number;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function QuickBuy({
  selectedVariant,
  productName,
  price,
}: Props) {
  const [status, setStatus] = useState<Status>('idle');

  const handleQuickBuy = async () => {
    if (!selectedVariant || selectedVariant.stock === 0) return;

    setStatus('loading');

    // simulate order processing
    await new Promise((r) => setTimeout(r, 1000));

    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const isDisabled =
    !selectedVariant ||
    selectedVariant.stock === 0 ||
    status === 'loading';

  return (
    <div className="mt-6">
      <button
        onClick={handleQuickBuy}
        disabled={isDisabled}
        className={`
          w-full max-w-xs py-3 px-8 rounded-xl text-white
          font-semibold text-base transition
          ${isDisabled
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gray-900 hover:bg-gray-700 cursor-pointer'
          }
        `}
      >
        {status === 'loading'
          ? 'Processing...'
          : !selectedVariant
          ? 'Select a variant first'
          : selectedVariant.stock === 0
          ? 'Out of stock'
          : `Quick Buy — $${price.toFixed(2)}`}
      </button>

      {status === 'success' && selectedVariant && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Order placed for{' '}
          <span className="font-semibold">{productName}</span>{' '}
          —{' '}
          <span className="font-semibold">
            {selectedVariant.combinationKey}
          </span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}