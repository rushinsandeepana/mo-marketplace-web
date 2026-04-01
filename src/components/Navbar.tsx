import { Link, useNavigate } from 'react-router-dom';
import { authStore } from '../store/auth.store';

export default function Navbar() {
  const navigate = useNavigate();
  const user = authStore.getUser();

  const handleLogout = () => {
    authStore.clearAuth();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-bold text-white hover:text-gray-300 transition"
        >
          MO Marketplace
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/products/new"
            className="text-sm text-gray-300 hover:text-white transition"
          >
            + New Product
          </Link>

          <span className="text-sm text-gray-400">
            {user?.email}
          </span>

          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}