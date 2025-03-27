export interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface CourseContent {
  id: number;
  course_id: number;
  title: string;
  type: 'video' | 'pdf' | 'quiz';
  content_url?: string;
  order: number;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  questions: QuizQuestion[];
  time_limit: number; // in minutes
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface QuizSubmission {
  id: number;
  quiz_id: number;
  user_id: number;
  answers: number[];
  score: number;
  completed_at: string;
}

export interface Progress {
  course_id: number;
  completed_content: number[];
  quiz_scores: Record<number, number>;
  overall_progress: number;
}

export interface ForumPost {
  id: number;
  course_id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  replies: ForumReply[];
}

export interface ForumReply {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
}