import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authStore } from '../store/auth.store';
import { cartStore } from '../store/cart.store';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authStore.getUser();
  const [cartCount, setCartCount] = useState(cartStore.totalCount());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const sync = () => setCartCount(cartStore.totalCount());
    window.addEventListener('cart-updated', sync);
    return () => window.removeEventListener('cart-updated', sync);
  }, []);

  const handleLogout = () => {
    authStore.clearAuth();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-1 bg-opacity-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          <Link to="/" className="text-xl font-bold text-white hover:text-gray-300 transition">
            <img src="/logo/nav-logo.png" alt="MO Marketplace Logo" className="w-24 h-auto" />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/products/new"
              className="text-sm font-semibold text-gray-200 hover:text-white transition"
            >
              + New Product
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative text-gray-200 hover:text-white transition p-1"
              aria-label="Open cart"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-9-4h4" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white
                  text-xs font-bold rounded-full w-5 h-5 flex items-center
                  justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            <span className="text-sm font-semibold text-gray-400">
              {user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-300 px-4 py-2 border border-gray-600
                rounded-lg hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}