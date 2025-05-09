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

// Mock course content data
const mockCourseContent = {
  1: [
    {
      id: 1,
      course_id: 1,
      title: 'Introduction to HCI',
      type: 'pdf',
      content_url: 'https://example.com/hci-intro.pdf',
      order: 1
    },
    {
      id: 2,
      course_id: 1,
      title: 'User-Centered Design Principles',
      type: 'video',
      content_url: 'https://example.com/ucd-principles.mp4',
      order: 2
    },
    {
      id: 3,
      course_id: 1,
      title: 'Usability Testing Methods',
      type: 'pdf',
      content_url: 'https://example.com/usability-testing.pdf',
      order: 3
    }
  ],
  2: [
    {
      id: 4,
      course_id: 2,
      title: 'Neural Networks Fundamentals',
      type: 'pdf',
      content_url: 'https://example.com/neural-networks.pdf',
      order: 1
    },
    {
      id: 5,
      course_id: 2,
      title: 'Deep Learning Architecture',
      type: 'video',
      content_url: 'https://example.com/deep-learning.mp4',
      order: 2
    },
    {
      id: 6,
      course_id: 2,
      title: 'Natural Language Processing',
      type: 'pdf',
      content_url: 'https://example.com/nlp.pdf',
      order: 3
    }
  ],
  3: [
    {
      id: 7,
      course_id: 3,
      title: 'Finite Automata',
      type: 'pdf',
      content_url: 'https://example.com/finite-automata.pdf',
      order: 1
    },
    {
      id: 8,
      course_id: 3,
      title: 'Regular Expressions',
      type: 'video',
      content_url: 'https://example.com/regex.mp4',
      order: 2
    },
    {
      id: 9,
      course_id: 3,
      title: 'Context-Free Grammars',
      type: 'pdf',
      content_url: 'https://example.com/cfg.pdf',
      order: 3
    }
  ],
  4: [
    {
      id: 10,
      course_id: 4,
      title: 'Python Basics',
      type: 'pdf',
      content_url: 'https://example.com/python-basics.pdf',
      order: 1
    },
    {
      id: 11,
      course_id: 4,
      title: 'Data Structures in Python',
      type: 'video',
      content_url: 'https://example.com/python-ds.mp4',
      order: 2
    },
    {
      id: 12,
      course_id: 4,
      title: 'Object-Oriented Programming',
      type: 'pdf',
      content_url: 'https://example.com/python-oop.pdf',
      order: 3
    }
  ]
};

// Mock quiz data
const mockQuizzes = {
  1: [
    {
      id: 1,
      course_id: 1,
      title: 'HCI Fundamentals Quiz',
      time_limit: 30,
      questions: [
        {
          id: 1,
          quiz_id: 1,
          question: 'What is the primary goal of user-centered design?',
          options: [
            'Making aesthetically pleasing interfaces',
            'Optimizing for developer efficiency',
            'Meeting user needs and expectations',
            'Reducing development costs'
          ],
          correct_answer: 2
        },
        {
          id: 2,
          quiz_id: 1,
          question: 'Which method is commonly used for usability testing?',
          options: [
            'Think-aloud protocol',
            'Database normalization',
            'Code refactoring',
            'Network optimization'
          ],
          correct_answer: 0
        }
      ]
    }
  ],
  2: [
    {
      id: 2,
      course_id: 2,
      title: 'Neural Networks Quiz',
      time_limit: 45,
      questions: [
        {
          id: 3,
          quiz_id: 2,
          question: 'What is a perceptron?',
          options: [
            'A type of computer monitor',
            'A single artificial neuron',
            'A database management system',
            'A programming language'
          ],
          correct_answer: 1
        },
        {
          id: 4,
          quiz_id: 2,
          question: 'What is backpropagation used for?',
          options: [
            'Network security',
            'Data compression',
            'Training neural networks',
            'File transfer'
          ],
          correct_answer: 2
        }
      ]
    }
  ]
};

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
    return mockCourses;
  },
  getById: async (id: number) => {
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
    return mockCourseContent[courseId] || [];
  },
  getQuizzes: async (courseId: number) => {
    return mockQuizzes[courseId] || [];
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
    return mockQuizzes[courseId] || [];
  },
  getById: async (quizId: number) => {
    for (const courseQuizzes of Object.values(mockQuizzes)) {
      const quiz = courseQuizzes.find(q => q.id === quizId);
      if (quiz) return quiz;
    }
    throw new Error('Quiz not found');
  },
  submit: async (quizId: number, answers: number[]) => {
    const mockSubmission = {
      score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      totalQuestions: answers.length,
      correctAnswers: Math.floor(Math.random() * answers.length) + 1,
    };
    return mockSubmission;
  },
};

export const progress = {
  getStudentProgress: async () => {
    const mockProgress = mockCourses.map(course => ({
      course_id: course.id,
      completed_content: [],
      quiz_scores: {},
      overall_progress: Math.floor(Math.random() * 100),
    }));
    return mockProgress;
  },
  getCourseProgress: async (courseId: number) => {
    return {
      course_id: courseId,
      completed_content: [],
      quiz_scores: {},
      overall_progress: Math.floor(Math.random() * 100),
    };
  },
};

export const forum = {
  getPosts: async (courseId?: number) => {
    const { data } = await api.get<ForumPost[]>(courseId ? `/forum?courseId=${courseId}` : '/forum');
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