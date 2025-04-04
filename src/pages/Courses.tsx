import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../services/api';
import { Course } from '../types/course';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, User, Plus, X } from 'lucide-react';

const Courses = () => {
  const { user } = useAuth();
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
  });

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courses.getAll();
        setCourseList(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCourse = await courses.create(newCourse);
      setCourseList((prev) => [...prev, createdCourse]);
      setShowCreateModal(false);
      setNewCourse({ title: '', description: '', thumbnail_url: '' });
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
        {isTeacherOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </button>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Course Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  id="thumbnail"
                  value={newCourse.thumbnail_url}
                  onChange={(e) => setNewCourse({ ...newCourse, thumbnail_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courseList.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{course.teacher_name || 'Instructor'}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>8 weeks</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;