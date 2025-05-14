import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courses } from '../services/api';
import { Course, CourseContent } from '../types/course';
import { useAuth } from '../context/AuthContext';
import { FileText, Upload, Download, Trash2, AlertCircle } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [contents, setContents] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (!id) return;
        const courseData = await courses.getById(Number(id));
        const contentData = await courses.getCourseContent(Number(id));
        setCourse(courseData);
        setContents(contentData);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !id) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'video/mp4', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only PDF, MP4, JPEG, and PNG files are allowed');
      return;
    }

    try {
      setUploadingFile(true);
      setError(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('content_type', file.type.split('/')[1] === 'pdf' ? 'document' : 'video');

      const response = await courses.uploadContent(Number(id), formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      setContents([response, ...contents]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (contentId: number) => {
    if (!id) return;
    try {
      const response = await courses.downloadContent(Number(id), contentId);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = contents.find(c => c.id === contentId)?.title || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    }
  };

  const handleDelete = async (contentId: number) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      await courses.deleteContent(Number(id), contentId);
      setContents(contents.filter(content => content.id !== contentId));
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content');
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
          <div className="bg-indigo-600 p-8">
            <h1 className="text-4xl font-bold text-white">{course.title}</h1>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>

          {isTeacherOrAdmin && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".pdf,.mp4,.jpg,.jpeg,.png"
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
                      <p className="mt-2 text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                    </div>
                  ) : (
                    'Click to upload PDF, MP4, JPEG, or PNG files (max 10MB)'
                  )}
                </span>
              </label>
            </div>
          )}

          <div className="space-y-4">
            {contents.map((content) => (
              <div key={content.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-indigo-600 mr-3" />
                    <div>
                      <h3 className="font-medium">{content.title}</h3>
                      <p className="text-sm text-gray-500">{content.content_type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {content.file_path && (
                      <button
                        onClick={() => handleDownload(content.id)}
                        className="p-2 text-gray-600 hover:text-indigo-600"
                        title="Download"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                    {isTeacherOrAdmin && (
                      <button
                        onClick={() => handleDelete(content.id)}
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
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;