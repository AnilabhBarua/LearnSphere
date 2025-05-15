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
  HelpCircle,
  FileText
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
        <div className="w-72 bg-white shadow-xl">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">LearnSphere</span>
            </Link>
          </div>
          <nav className="mt-6 px-4">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
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
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/courses')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="h-5 w-5 mr-3" />
              Courses
            </Link>
            {user.role === 'student' && (
              <Link
                to="/quiz"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname.startsWith('/quiz')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <HelpCircle className="h-5 w-5 mr-3" />
                Quizzes
              </Link>
            )}
            {(user.role === 'teacher' || user.role === 'admin') && (
              <>
                <Link
                  to="/quiz-management"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/quiz-management')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Quiz Management
                </Link>
                <Link
                  to="/reports"
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/reports')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Reports
                </Link>
              </>
            )}
            <Link
              to="/progress"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
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
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
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
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
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
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="h-16 flex items-center justify-end px-6">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;