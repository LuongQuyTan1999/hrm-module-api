// src/modules/ai/types/ai.types.ts
export interface ChatResponse {
  success: boolean;
  message: string;
  toolCalls?: ToolCall[];
  conversation?: ConversationItem[];
  error?: string;
}

export interface ToolCall {
  name: string;
  args: any;
}

export interface ConversationItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface EmployeeSearchParams {
  query?: string;
  department?: string;
  role?: string;
  limit?: number;
}

export interface EmployeeUpdateParams {
  name: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  department?: string;
  position?: string;
  contractType?: 'full_time' | 'part_time' | 'intern';
  contractStart?: string;
  contractEnd?: string;
}
