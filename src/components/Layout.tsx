import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  BookOpen,
  User,
  LayoutDashboard,
  GraduationCap,
  BarChart2,
  Settings,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { auth } from '../services/api';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {user && (
        <div className="w-64 bg-white shadow-md">
          <div className="h-16 flex items-center px-4">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LMS</span>
            </Link>
          </div>
          <nav className="mt-4">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                isActive('/dashboard')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/courses"
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                isActive('/courses')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="h-5 w-5 mr-3" />
              Courses
            </Link>
            <Link
              to="/quiz"
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                location.pathname.startsWith('/quiz')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              Quizzes
            </Link>
            <Link
              to="/progress"
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                isActive('/progress')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Progress
            </Link>
            <Link
              to="/forum"
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                isActive('/forum')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Forum
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 text-sm font-medium ${
                  isActive('/admin')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="h-16 flex items-center justify-end px-4">
            {user && (
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">
                  <User className="inline-block h-5 w-5 mr-1" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;