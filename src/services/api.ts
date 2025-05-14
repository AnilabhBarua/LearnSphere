import axios from 'axios';
import { Course, Quiz, Progress, ForumPost } from '../types/course';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Mock users for development
const mockUsers = {
  'admin@lms.com': { 
    password: 'admin123', 
    role: 'admin', 
    name: 'Admin User',
    id: 1,
    email: 'admin@lms.com',
    created_at: new Date().toISOString()
  },
  'teacher@lms.com': { 
    password: 'teacher123', 
    role: 'teacher', 
    name: 'Teacher User',
    id: 2,
    email: 'teacher@lms.com',
    created_at: new Date().toISOString()
  },
  'student@lms.com': { 
    password: 'student123', 
    role: 'student', 
    name: 'Student User',
    id: 3,
    email: 'student@lms.com',
    created_at: new Date().toISOString()
  }
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    // Check for mock users first
    const mockUser = mockUsers[credentials.email];
    if (mockUser && mockUser.password === credentials.password) {
      const mockResponse = {
        user: mockUser,
        token: 'mock-jwt-token'
      };
      return mockResponse;
    }

    // If not a mock user, proceed with real authentication
    try {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const courses = {
  getAll: async () => {
    const { data } = await api.get<Course[]>('/courses');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Course>(`/courses/${id}`);
    return data;
  },
  create: async (courseData: Partial<Course>) => {
    const { data } = await api.post<Course>('/courses', courseData);
    return data;
  },
  getCourseContent: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/content`);
    return data;
  },
  uploadContent: async (courseId: number, formData: FormData, onProgress?: (progressEvent: any) => void) => {
    const { data } = await api.post(`/courses/${courseId}/content`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    return data;
  },
  downloadContent: async (contentId: number) => {
    return api.get(`/courses/content/${contentId}/download`, {
      responseType: 'blob',
    });
  },
  deleteContent: async (contentId: number) => {
    return api.delete(`/courses/content/${contentId}`);
  },
};

export const progress = {
  getStudentProgress: async () => {
    const { data } = await api.get<Progress[]>('/progress');
    return data;
  },
};