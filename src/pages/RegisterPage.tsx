import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { authStore } from '../store/auth.store';

const schema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(50, 'Name must be less than 50 characters'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'At least 6 characters'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.register(data.name, data.email, data.password);
      authStore.setAuth(res.accessToken, res.user);
      navigate('/');
    } catch (err: any) {
      setError('root', {
        message:
          err.response?.data?.message ?? 'Registration failed.',
      });
    }
  };

  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl border text-sm
    focus:outline-none focus:ring-2 focus:ring-black
    ${hasError ? 'border-red-500' : 'border-gray-300'}
    transition-colors duration-200
  `;

  return (
    <div className="min-h-screen flex">
      {/* Left side: hero image + logo */}
      <div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/fashion-hero.jpg')" }}
      >
        <div className="bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center px-4">
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
          <h2 className="text-3xl font-bold text-black mb-4 text-center">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Start your fashion journey with MO Fashion Store
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="John Doe"
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={inputClass(!!errors.password)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className={inputClass(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Root Error */}
            {errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 rounded-xl text-white font-semibold text-sm
                transition-all duration-200
                ${isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 shadow-md'
                }
              `}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-black font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}