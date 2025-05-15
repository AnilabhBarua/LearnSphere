import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types/auth';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const response = await auth.login(data);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-600" />
            <h1 className="ml-3 text-4xl font-bold text-gray-900">LearnSphere</h1>
          </div>
          <p className="text-gray-600">Your Gateway to Knowledge and Growth</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Welcome Back</h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white rounded-lg py-3 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02]"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 LearnSphere. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;