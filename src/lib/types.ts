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
