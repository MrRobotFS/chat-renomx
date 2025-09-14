'use client'

import { Plus, MessageCircle, Settings, LogOut, Trash2 } from 'lucide-react'
import { Conversation, User } from '@/lib/types'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  user: User | null
  onLogout: () => void
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation, 
  onDeleteConversation,
  user,
  onLogout
}: SidebarProps) {
  return (
    <aside 
      className={`sidebar-transition ${
        isOpen ? 'translate-x-0 md:w-64' : '-translate-x-full md:w-0'
      } fixed md:relative z-30 inset-y-0 left-0 w-64 bg-white dark:bg-dark border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <img 
            src="/renovables-logo.png" 
            alt="Renovables del Sur MX" 
            className="h-8 w-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">Renobot</span>
            {user && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.employee.full_name}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={onNewConversation}
          className="w-full flex items-center space-x-2 p-3 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nueva conversación</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Conversaciones recientes
        </h3>
        {conversations.map((conversation) => (
          <div key={conversation.id} className="group relative">
            <button
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                currentConversationId === conversation.id 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' 
                  : 'hover:bg-gray-100 dark:hover:bg-dark'
              }`}
            >
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {conversation.title || 'Nueva conversación'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(conversation.updated_at).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteConversation(conversation.id)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark rounded-lg transition-colors duration-200">
          <Settings className="h-5 w-5" />
          <span className="text-sm">Configuración</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}