import { LoginRequest, LoginResponse, ChatRequest, ChatResponse, Conversation, User, Message } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_BASE = `${BASE_URL}/api/chatbot`

class ApiClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
    }
  }

  getToken(): string | null {
    return this.token
  }

  getBaseUrl(): string {
    return API_BASE
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken()
          throw new Error('Authentication failed')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/employee/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.success) {
      this.setToken(response.access)
    }
    
    return response
  }

  async getProfile(): Promise<User> {
    return await this.request<User>('/employee/profile/')
  }

  async getConversations(): Promise<Conversation[]> {
    return await this.request<Conversation[]>('/employee/conversations/')
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return await this.request<Conversation>(`/employee/conversations/${conversationId}/`)
  }

  async sendMessage(chatRequest: ChatRequest, userContext?: any): Promise<ChatResponse> {
    const url = 'https://n8n.srv865372.hstgr.cloud/webhook/615091e3-d7c3-477d-9d64-fae01c60845b';
    const headers = {
      'Content-Type': 'application/json',
    };

    // Prepare payload with user context and file information
    const payload = {
      message: chatRequest.message,
      conversation_id: chatRequest.conversation_id,
      has_file: chatRequest.has_file || false,
      file: chatRequest.file ? {
        name: chatRequest.file.name,
        size: chatRequest.file.size,
        type: chatRequest.file.type,
        extension: chatRequest.file.extension,
        data: chatRequest.file.data // base64 si está disponible
      } : null,
      user: userContext ? {
        email: userContext.email,
        username: userContext.username,
        full_name: userContext.employee?.full_name,
        department: userContext.employee?.department,
        role: userContext.employee?.role_name,
        role_code: userContext.employee?.role_code,
        employee_id: userContext.employee?.employee_id
      } : null
    };

    try {
      const startTime = Date.now();
      
      const apiResponse = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const responseData = await apiResponse.json();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const aiContent = responseData[0]?.output || "Lo siento, no pude obtener una respuesta.";

      const conversationId = chatRequest.conversation_id || crypto.randomUUID();

      const userMessage: Message = {
        id: Date.now(),
        content: chatRequest.message,
        is_user: true,
        timestamp: new Date().toISOString(),
        has_file: chatRequest.has_file || false,
        file: chatRequest.file,
      };

      const aiMessage: Message = {
        id: Date.now() + 1,
        content: aiContent,
        is_user: false,
        timestamp: new Date().toISOString(),
        response_time: responseTime,
        has_file: false,
      };

      const chatResponse: ChatResponse = {
        conversation_id: conversationId,
        user_message: userMessage,
        ai_response: aiMessage,
        source: 'n8n_webhook',
      };

      return chatResponse;

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async uploadFile(conversationId: string, file: File): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_name', file.name)
    formData.append('file_type', file.type.startsWith('image/') ? 'image' : 'document')

    const headers: Record<string, string> = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${API_BASE}/employee/conversations/${conversationId}/upload/`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }

  logout() {
    this.clearToken()
  }
}

export const apiClient = new ApiClient()

// Legacy function for backward compatibility
export async function sendMessageToRenobot(message: string): Promise<string> {
  try {
    const response = await apiClient.sendMessage({ message, has_file: false })
    return response.ai_response.content
  } catch (error) {
    console.error('Error sending message to Renobot:', error)
    return 'Lo siento, hubo un problema de conexión. Por favor, inténtalo de nuevo.'
  }
}