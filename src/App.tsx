import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from './pages/CreateProductPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/products" element={
          <PrivateRoute>
            <ProductListPage />
          </PrivateRoute>
        } />
        <Route path="/products/new" element={
          <PrivateRoute>
            <CreateProductPage />
          </PrivateRoute>
        } />
        <Route path="/products/:id" element={
          <PrivateRoute>
            <ProductDetailPage />
          </PrivateRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}