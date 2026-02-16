// Student level types
export type StudentLevel = '상위' | '중위' | '하위' | '기초';

// Student profile from Supabase
export interface StudentProfile {
  user_id: string;
  display_name: string;
  level: StudentLevel;
  score_range: string;
  avatar_emoji: string;
  created_at?: string;
}

// Chat message types
export interface ChatMessage {
  id: string;
  type: 'human' | 'ai';
  content: string;
  timestamp: string;
}

// Database message format (JSONB structure in n8n_chat_histories)
// Note: Actual structure will be confirmed after first test
export interface DatabaseMessage {
  type: 'human' | 'ai';
  data: {
    content: string;
  };
}

// n8n webhook response format (ARRAY!)
export type N8nResponse = Array<{
  output: string;
}>;

// Mem0 memory interface
export interface Mem0Memory {
  memory: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

// Mem0 API response
export interface Mem0Response {
  results: Mem0Memory[];
}

// Demo account interface
export interface DemoAccount {
  name: string;
  email: string;
  password: string;
  uid: string;
  level: StudentLevel;
  scoreRange: string;
  description: string;
  emoji: string;
}

// Auth context types
export interface AuthContextType {
  user: any | null; // Supabase User type
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Chat context types
export interface ChatContextType {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
}

// Assignment types
export interface TeacherAssignment {
  id: number;
  teacher_id: string;
  exam_id: number | null;
  exam_content: string;
  student_ids: string[];
  status: 'active' | 'closed';
  due_date: string | null;
  created_at: string;
}

export interface StudentSubmission {
  id: number;
  assignment_id: number;
  student_id: string;
  answers: StudentAnswer[];
  score: number | null;
  grading_result: string | null;
  status: 'pending' | 'submitted' | 'graded';
  submitted_at: string | null;
  graded_at: string | null;
  created_at: string;
}

export interface StudentAnswer {
  problem_num: number;
  answer: string;
}

export interface PendingAssignment {
  id: number;
  assignment_id: number;
  status: 'pending' | 'submitted' | 'graded';
  teacher_assignments: TeacherAssignment;
}

// Parsed exam content
export interface ParsedExam {
  problems: string[];
  answers: string[];
  problemCount: number;
}

// Grading API request
export interface GradingProblem {
  id: string;
  question: string;
  correct_answer: string;
  student_answer: string;
}

export interface GradingRequest {
  teacher_id: string;
  student_id: string;
  problems: GradingProblem[];
}

// Grading API response (same format as n8n - array)
export type GradingResponse = Array<{
  output: string;
}>;
