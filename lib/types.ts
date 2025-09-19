export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions: string[]
  chat_context?: string
  is_active: boolean
}

export interface Employee {
  id: number
  employee_id: string
  full_name: string
  email?: string
  role: number
  role_name: string
  role_code: string
  role_details: Role
  department?: string
  is_active: boolean
  username: string
  user_email: string
  created_at: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  employee: Employee
}

export interface FileAttachment {
  name: string
  size: number
  type: string
  extension: string
  data?: string // base64 data para enviar a n8n
  duration?: number // duración en segundos para archivos de audio
  url?: string // URL del archivo si está disponible
  driveId?: string // ID de Google Drive si aplica
}

export interface Message {
  id: number
  content: string
  is_user: boolean
  timestamp: string
  response_time?: number
  file?: FileAttachment
  has_file: boolean
}

export interface ConversationMedia {
  id: number
  file: string
  file_name: string
  file_type: string
  file_size: number
  uploaded_at: string
  uploaded_by_user: boolean
}

export interface Conversation {
  id: string
  employee: Employee
  title?: string
  is_active: boolean
  created_at: string
  updated_at: string
  messages?: Message[]
  media?: ConversationMedia[]
  message_count?: number
  last_message?: Message
}

export interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  user: User | null
  token: string | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user: User
  access: string
  refresh: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string
  file?: FileAttachment
  has_file: boolean
}

export interface ChatResponse {
  conversation_id: string
  user_message: Message
  ai_response: Message
  source: string
}