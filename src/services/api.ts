import axios from 'axios';
import { Course, Quiz, Progress, ForumPost } from '../types/course';

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

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
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
  update: async (id: number, courseData: Partial<Course>) => {
    const { data } = await api.put<Course>(`/courses/${id}`, courseData);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/courses/${id}`);
  },
};

export const quizzes = {
  getAll: async (courseId: number) => {
    const { data } = await api.get<Quiz[]>(`/courses/${courseId}/quizzes`);
    return data;
  },
  getById: async (quizId: number) => {
    const { data } = await api.get<Quiz>(`/quizzes/${quizId}`);
    return data;
  },
  submit: async (quizId: number, answers: number[]) => {
    const { data } = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return data;
  },
};

export const progress = {
  getStudentProgress: async () => {
    const { data } = await api.get<Progress[]>('/progress');
    return data;
  },
  getCourseProgress: async (courseId: number) => {
    const { data } = await api.get<Progress>(`/progress/${courseId}`);
    return data;
  },
};

export const forum = {
  getPosts: async (courseId?: number) => {
    const url = courseId ? `/forum?courseId=${courseId}` : '/forum';
    const { data } = await api.get<ForumPost[]>(url);
    return data;
  },
  createPost: async (postData: Partial<ForumPost>) => {
    const { data } = await api.post<ForumPost>('/forum', postData);
    return data;
  },
  createReply: async (postId: number, content: string) => {
    const { data } = await api.post(`/forum/${postId}/replies`, { content });
    return data;
  },
};

export const users = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  },
  updateUser: async (userId: number, userData: any) => {
    const { data } = await api.put(`/users/${userId}`, userData);
    return data;
  },
  deleteUser: async (userId: number) => {
    await api.delete(`/users/${userId}`);
  },
};

export default api;