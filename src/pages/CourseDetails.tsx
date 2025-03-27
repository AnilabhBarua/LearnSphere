import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courses } from '../services/api';
import { Course, CourseContent } from '../types/course';
import { Play, FileText, HelpCircle, MessageSquare } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'discussion'>('content');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseData = await courses.getById(Number(id));
        setCourse(courseData);
        // Fetch course contents would go here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Course not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{course.title}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'content'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Course Content
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'discussion'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Discussion
            </button>
          </div>

          {activeTab === 'content' ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <Play className="h-5 w-5 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Introduction to the Course</h3>
                    <p className="text-sm text-gray-500">15 minutes</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Course Materials</h3>
                    <p className="text-sm text-gray-500">PDF Document</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-indigo-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Module 1 Quiz</h3>
                    <p className="text-sm text-gray-500">10 questions</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="font-medium">John Doe</p>
                    <p className="text-gray-600">This course is amazing! I'm learning so much.</p>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="mt-6">
                <textarea
                  placeholder="Add to the discussion..."
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  rows={3}
                ></textarea>
                <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Post Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;