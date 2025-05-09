import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../services/api';
import { Course, CourseContent, Quiz as QuizType } from '../types/course';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'quizzes' | 'discussion'>('content');
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (!id) return;
        const [courseData, contentData, quizzesData] = await Promise.all([
          courses.getById(Number(id)),
          courses.getCourseContent(Number(id)),
          courses.getQuizzes(Number(id))
        ]);
        setCourse(courseData);
        setContents(contentData);
        setQuizzes(quizzesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !course) return;

    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', course.id.toString());
      formData.append('title', file.name);
      formData.append('type', 'pdf');

      const response = await courses.uploadContent(formData, (progress) => {
        setUploadProgress(Math.round((progress.loaded * 100) / progress.total));
      });

      setContents((prev) => [...prev, response]);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      await courses.deleteContent(contentId);
      setContents((prev) => prev.filter((content) => content.id !== contentId));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleDownload = async (content: CourseContent) => {
    try {
      const response = await courses.downloadContent(content.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = content.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

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
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'quizzes'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quizzes
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

          {activeTab === 'content' && (
            <div className="space-y-4">
              {isTeacherOrAdmin && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="fileUpload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-sm text-gray-600">
                      {uploadingFile ? (
                        <div className="w-full max-w-xs mx-auto">
                          <div className="bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">DATA IS BEING UPLOADED{uploadProgress}%</p>
                        </div>
                      ) : (
                        'Click to upload PDF files'
                      )}
                    </span>
                  </label>
                </div>
              )}

              {contents.map((content) => (
                <div key={content.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <p className="text-sm text-gray-500">{content.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(content)}
                        className="p-2 text-gray-600 hover:text-indigo-600"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      {isTeacherOrAdmin && (
                        <button
                          onClick={() => handleDeleteContent(content.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {contents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No content available for this course yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'quizzes' && (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-500">
                        {quiz.questions.length} questions • {quiz.time_limit} minutes
                      </p>
                    </div>
                    <Link
                      to={`/courses/${id}/quiz/${quiz.id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Start Quiz
                    </Link>
                  </div>
                </div>
              ))}
              {quizzes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No quizzes available for this course yet.
                </div>
              )}
            </div>
          )}

          {activeTab === 'discussion' && (
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