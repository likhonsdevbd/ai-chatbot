import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Types for database
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  parts: MessagePart[];
  created_at: string;
}

export interface MessagePart {
  type: 'text' | 'reasoning' | 'chain-of-thought' | 'source-url' | 'tool-call' | 'tool-result';
  text?: string;
  url?: string;
  name?: string;
  result?: any;
  reasoningSteps?: ReasoningStep[];
}

export interface ReasoningStep {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  timestamp?: string;
  type?: 'thought' | 'search' | 'analysis' | 'conclusion';
  metadata?: {
    searchQuery?: string;
    searchResults?: SearchResult[];
    images?: ImageReference[];
    sources?: string[];
    confidence?: number;
  };
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

export interface ImageReference {
  url: string;
  caption?: string;
  alt?: string;
}

export interface Attachment {
  id: string;
  message_id?: string;
  conversation_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
}
