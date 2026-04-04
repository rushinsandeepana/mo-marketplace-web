import { useEffect, useState } from 'react';
import { cartStore, type CartItem } from '../store/cart.store';
import { ordersApi } from '../api/orders.api';
import { getImageUrl } from '../utils/imageUtils';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function CartDrawer({ open, onClose }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const sync = () => setItems(cartStore.getItems());
    sync();
    window.addEventListener('cart-updated', sync);
    return () => window.removeEventListener('cart-updated', sync);
  }, [open]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!items.length) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await ordersApi.create({
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      });

      window.dispatchEvent(
        new CustomEvent('order-placed', {
          detail: { updatedStocks: result.updatedStocks },
        }),
      );

      cartStore.clear();
      setStatus('success');
    } catch (e: any) {
      setErrorMsg(e.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'success') setStatus('idle');
    onClose();
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50
          shadow-2xl flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 transition p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-4h4" />
              </svg>
              <p className="text-gray-400 text-sm">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-start gap-3 border border-gray-100 rounded-xl p-3"
              >
                {item.imageUrl && (
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/dummy_image.jpg';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">{item.variantKey}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.quantity > 1)
                          cartStore.updateQuantity(item.variantId, item.quantity - 1);
                      }}
                      className="w-7 h-7 rounded border border-gray-300 flex items-center
                        justify-center hover:bg-gray-50 transition text-sm font-medium"
                    >
                      −
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        cartStore.updateQuantity(item.variantId, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded border border-gray-300 flex items-center
                        justify-center hover:bg-gray-50 transition text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => cartStore.removeItem(item.variantId)}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            {status === 'success' ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="font-bold text-green-800 text-base mb-1">Order placed!</p>
                <p className="text-green-600 text-sm mb-3">
                  We'll process it shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="text-sm text-green-700 underline"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center text-lg font-bold mb-4">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>

                {status === 'error' && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg
                    text-red-600 text-sm text-center">
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={status === 'loading'}
                  className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold
                    py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Placing order...' : 'Place order'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}