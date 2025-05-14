import axios from 'axios';
import { Course, Quiz, Progress, CourseContent } from '../types/course';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    const { data } = await api.get<CourseContent[]>(`/courses/${courseId}/content`);
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
  
  downloadContent: async (courseId: number, contentId: number) => {
    return api.get(`/courses/${courseId}/content/${contentId}/download`, {
      responseType: 'blob',
    });
  },
  
  deleteContent: async (courseId: number, contentId: number) => {
    return api.delete(`/courses/${courseId}/content/${contentId}`);
  },
};

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
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

export const progress = {
  getStudentProgress: async () => {
    const { data } = await api.get<Progress[]>('/progress');
    return data;
  },
};