import React, { useState } from 'react';
import { Users, BookOpen, UserCheck } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'enrollments'>('users');

  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
  ];

  const mockCourses = [
    { id: 1, title: 'Web Development', enrolled: 150, teacher: 'Jane Smith' },
    { id: 2, title: 'Data Science', enrolled: 120, teacher: 'Mike Johnson' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'courses'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Courses
            </button>
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === 'enrollments'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Enrollments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">User Management</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Course Management</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Course
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrolled Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.enrolled}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{course.teacher}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                          <button className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'enrollments' && (
            <div>
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Enrollment Management</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Enrollment
                </button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      New enrollment requests pending approval
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">John Doe</h3>
                      <p className="text-sm text-gray-500">Web Development Course</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;