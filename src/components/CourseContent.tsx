import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { courses } from '../services/api';
import { CourseContent as CourseContentType } from '../types/course';

interface CourseContentProps {
  courseId: number;
  contents: CourseContentType[];
  onContentUpdate: (contents: CourseContentType[]) => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ courseId, contents, onContentUpdate }) => {
  const { user } = useAuth();
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      formData.append('courseId', courseId.toString());
      formData.append('title', file.name);
      formData.append('content_type', file.type.split('/')[1]);

      const response = await courses.uploadContent(formData, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      onContentUpdate([...contents, response]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (content: CourseContentType) => {
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
      setError('Failed to download file. Please try again.');
    }
  };

  const handleDelete = async (contentId: number) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      await courses.deleteContent(contentId);
      onContentUpdate(contents.filter(content => content.id !== contentId));
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {isTeacherOrAdmin && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
  );
};

export default CourseContent;