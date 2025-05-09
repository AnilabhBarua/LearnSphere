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

// Mock course data
const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Human-Computer Interaction (HCI)',
    description: 'Learn about designing effective, efficient, and enjoyable user interfaces. This course covers principles of user-centered design, usability testing, and interaction design patterns.',
    teacher_id: 1,
    thumbnail_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Artificial Intelligence and Machine Learning',
    description: 'Explore the fundamentals of AI/ML, including neural networks, deep learning, natural language processing, and computer vision. Learn to implement modern AI algorithms.',
    teacher_id: 1,
    thumbnail_url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Formal Languages and Automata Theory',
    description: 'Study the mathematical foundations of computer science, including finite automata, regular expressions, context-free grammars, and Turing machines.',
    teacher_id: 2,
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Python Programming',
    description: 'Master Python programming from basics to advanced concepts. Learn data structures, algorithms, object-oriented programming, and popular frameworks.',
    teacher_id: 2,
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const auth = {
  login: async (credentials: { email: string; password: string }) => {
    // Mock credentials for testing
    const mockUsers = {
      'admin@lms.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
      'teacher@lms.com': { password: 'teacher123', role: 'teacher', name: 'Teacher User' },
      'student@lms.com': { password: 'student123', role: 'student', name: 'Student User' },
    };

    // Check if using mock credentials
    const mockUser = mockUsers[credentials.email];
    if (mockUser && mockUser.password === credentials.password) {
      const mockResponse = {
        user: {
          id: Math.floor(Math.random() * 1000),
          email: credentials.email,
          name: mockUser.name,
          role: mockUser.role,
          created_at: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
      };
      return mockResponse;
    }

    // If not using mock credentials, proceed with actual API call
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
    // Return mock courses instead of making API call
    return mockCourses;
  },
  getById: async (id: number) => {
    // Return mock course by id
    const course = mockCourses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return course;
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
  getCourseContent: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/content`);
    return data;
  },
  uploadContent: async (formData: FormData, onProgress?: (progressEvent: any) => void) => {
    const { data } = await api.post('/courses/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    return data;
  },
  downloadContent: async (contentId: number) => {
    return await api.get(`/courses/content/${contentId}/download`, {
      responseType: 'blob',
    });
  },
  deleteContent: async (contentId: number) => {
    await api.delete(`/courses/content/${contentId}`);
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