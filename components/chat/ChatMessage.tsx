import { User, Check, CheckCheck, AlertCircle, Copy, Clock, FileText, Image as ImageIcon, Video, Music, Archive, Download } from 'lucide-react'
import { Message } from '@/lib/types'
import { useState } from 'react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.is_user

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`
    } else {
      return `${(ms / 1000).toFixed(1)}s`
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Music className="h-4 w-4" />
      case 'archive': return <Archive className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = () => {
    if (!message.is_user) return null
    
    // For Django backend messages, we'll show sent status
    return <CheckCheck className="w-3 h-3 text-tertiary-200" />
  }

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`flex items-start space-x-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-gradient-to-br from-tertiary to-tertiary-600' : 'bg-white dark:bg-dark shadow-sm'
        } p-1`}>
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <img 
              src="/renovables-logo.png" 
              alt="Renobot" 
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`
            relative px-4 py-3 rounded-2xl shadow-lg
            ${isUser 
              ? 'bg-tertiary text-white rounded-br-md' 
              : 'bg-white dark:bg-dark text-gray-900 dark:text-white rounded-bl-md border border-gray-100 dark:border-gray-700'
            }
          `}>
            {/* File attachment display */}
            {message.has_file && message.file && (
              <div className={`mb-3 p-3 rounded-lg border ${
                isUser 
                  ? 'bg-tertiary-700 border-tertiary-600' 
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isUser ? 'bg-tertiary-600 text-white' : 'bg-primary-100 dark:bg-primary-900 text-primary'
                  }`}>
                    {getFileIcon(message.file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isUser ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {message.file.name}
                    </p>
                    <p className={`text-xs ${
                      isUser ? 'text-tertiary-200' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatFileSize(message.file.size)} • {message.file.extension.toUpperCase()}
                    </p>
                  </div>
                  {message.file.url && (
                    <a
                      href={message.file.url}
                      download={message.file.name}
                      className={`p-1 rounded transition-colors ${
                        isUser 
                          ? 'text-white hover:bg-tertiary-600' 
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      title="Descargar archivo"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere">
              {message.content}
            </p>

            {/* Message Actions */}
            <div className={`
              absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200
              ${isUser ? '-left-8' : '-right-8'}
            `}>
              <button
                onClick={copyMessage}
                className="p-1 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-dark shadow-sm rounded transition-colors duration-200"
                title={copied ? 'Copiado!' : 'Copiar mensaje'}
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Timestamp, Status and Response Time */}
          <div className={`flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 ${
            isUser ? 'flex-row-reverse space-x-reverse' : ''
          }`}>
            <span>{formatTime(message.timestamp)}</span>
            {!isUser && message.response_time && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatResponseTime(message.response_time)}</span>
              </div>
            )}
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  )
}