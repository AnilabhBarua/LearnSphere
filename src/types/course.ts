export interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number | null;
  created_at: string;
}

export interface CourseContent {
  id: number;
  course_id: number;
  title: string;
  content: string;
  content_type: 'video' | 'document' | 'quiz' | 'assignment';
  file_path: string | null;
  created_at: string;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  questions: QuizQuestion[];
  time_limit: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export interface Progress {
  course_id: number;
  completed_content: number[];
  quiz_scores: Record<number, number>;
  overall_progress: number;
}