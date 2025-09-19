import { LoginRequest, LoginResponse, ChatRequest, ChatResponse, Conversation, User, Message } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_BASE = `${BASE_URL}/api/chatbot`
const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://n8n.srv865372.hstgr.cloud/webhook/615091e3-d7c3-477d-9d64-fae01c60845b'

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
    // Call n8n webhook directly
    const payload = {
      message: chatRequest.message,
      conversation_id: chatRequest.conversation_id || this.generateConversationId(),
      has_file: !!chatRequest.file,
      file: chatRequest.file ? {
        name: chatRequest.file.name,
        size: chatRequest.file.size,
        type: chatRequest.file.type,
        extension: chatRequest.file.extension,
        data: chatRequest.file.data
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
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`N8N webhook error! status: ${response.status}`)
      }

      const responseData = await response.json()

      // Parse n8n response
      let ai_content = 'No response from AI'
      if (Array.isArray(responseData) && responseData.length > 0) {
        ai_content = responseData[0].output || 'No response from AI'
      } else if (responseData.output) {
        ai_content = responseData.output
      }

      // Create standardized response format
      const chatResponse: ChatResponse = {
        conversation_id: payload.conversation_id,
        user_message: {
          id: Date.now(),
          content: chatRequest.message,
          is_user: true,
          timestamp: new Date().toISOString(),
          has_file: !!chatRequest.file,
          file: chatRequest.file
        },
        ai_response: {
          id: Date.now() + 1,
          content: ai_content,
          is_user: false,
          timestamp: new Date().toISOString(),
          has_file: false
        },
        source: 'n8n_direct'
      }

      return chatResponse
    } catch (error) {
      console.error('N8N webhook request failed:', error)

      // Return error response in expected format
      const errorResponse: ChatResponse = {
        conversation_id: payload.conversation_id,
        user_message: {
          id: Date.now(),
          content: chatRequest.message,
          is_user: true,
          timestamp: new Date().toISOString(),
          has_file: !!chatRequest.file,
          file: chatRequest.file
        },
        ai_response: {
          id: Date.now() + 1,
          content: `Lo siento, hubo un problema de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          is_user: false,
          timestamp: new Date().toISOString(),
          has_file: false
        },
        source: 'n8n_direct_error'
      }

      return errorResponse
    }
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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