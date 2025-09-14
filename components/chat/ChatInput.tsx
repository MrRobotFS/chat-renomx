'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, FileText, Image as ImageIcon, Video, Music, Archive } from 'lucide-react'
import { FileAttachment } from '@/lib/types'

interface ChatInputProps {
  onSendMessage: (message: string, file?: FileAttachment) => void
  disabled?: boolean
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para obtener la extensión del archivo
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  // Función para determinar el tipo de archivo
  const getFileType = (file: File): string => {
    const extension = getFileExtension(file.name)
    const mimeType = file.type.toLowerCase()
    
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'document'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive'
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'spreadsheet'
    return 'file'
  }

  // Función para convertir archivo a base64 (para archivos pequeños)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Manejar selección de archivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño máximo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Tamaño máximo: 10MB')
      return
    }

    try {
      const extension = getFileExtension(file.name)
      const fileType = getFileType(file)
      
      const fileAttachment: FileAttachment = {
        name: file.name,
        size: file.size,
        type: fileType,
        extension: extension
      }

      // Para archivos pequeños (< 1MB), convertir a base64
      if (file.size < 1024 * 1024) {
        fileAttachment.data = await fileToBase64(file)
      }

      setSelectedFile(fileAttachment)
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error al procesar el archivo')
    }
  }

  // Obtener icono según tipo de archivo
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Music className="h-4 w-4" />
      case 'archive': return <Archive className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Remover archivo seleccionado
  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if ((message.trim() || selectedFile) && !disabled) {
      onSendMessage(message.trim() || 'Archivo adjunto', selectedFile || undefined)
      setMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark p-4">
      {/* Preview de archivo seleccionado */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-gray-50 dark:bg-dark rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg text-primary">
                {getFileIcon(selectedFile.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(selectedFile.size)} • {selectedFile.extension.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <div className="relative flex items-center bg-gray-50 dark:bg-dark rounded-2xl border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-20 shadow-sm">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-primary transition-colors duration-200"
              disabled={disabled}
              title="Adjuntar archivo"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={disabled ? "Renobot está escribiendo..." : "Escribe tu mensaje aquí..."}
              className="flex-1 bg-transparent px-2 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none max-h-32 min-h-[24px]"
              rows={1}
              disabled={disabled}
            />
            
            {/* Character counter for very long messages */}
            {message.length > 500 && (
              <div className="absolute bottom-1 right-12 text-xs text-gray-400">
                {message.length}/2000
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || disabled || message.length > 2000}
          className={`p-3 rounded-full transition-all duration-200 ${
            (!message.trim() && !selectedFile) || disabled || message.length > 2000
              ? 'bg-gray-300 dark:bg-dark text-gray-500 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-600 text-white hover:scale-105 shadow-lg'
          }`}
          title={
            message.length > 2000 
              ? 'El mensaje es demasiado largo' 
              : disabled 
                ? 'Esperando respuesta...' 
                : selectedFile
                  ? 'Enviar archivo'
                  : 'Enviar mensaje'
          }
        >
          {disabled ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  )
}