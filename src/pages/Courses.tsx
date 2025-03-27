import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../services/api';
import { Course } from '../types/course';
import { Book, Clock, User } from 'lucide-react';

const Courses = () => {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
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
                <span className="mr-4">John Doe</span>
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