import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/auth.api';
import { authStore } from '../store/auth.store';

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setServerError('');
    try {
      const res = await authApi.login(data.email, data.password);
      authStore.setAuth(res.accessToken, res.user);
      navigate('/products');
    } catch (err: any) {
      setServerError(err.response?.data?.message ?? 'Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/fashion-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
          
          <div className="p-2 rounded-lg inline-block mb-2">
            <img
              src="/logo/logo.png"
              alt="MO Marketplace Logo"
              className="w-full h-auto"
            />
          </div>

          <h1 className="text-white text-4xl font-bold mb-3">
            Welcome to the MO Marketplace
          </h1>

        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold text-sm bg-gray-900 hover:bg-gray-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Don’t have an account?{' '}
            <a href="/register" className="text-gray-900 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}