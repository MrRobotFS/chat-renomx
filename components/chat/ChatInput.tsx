'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, FileText, Image as ImageIcon, Video, Music, Archive } from 'lucide-react'
import { FileAttachment } from '@/lib/types'
import { VoiceRecorder } from './VoiceRecorder'

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

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('Starting fileToBase64 conversion for:', file.name)
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        console.log('FileReader onload completed')
        const result = reader.result as string
        console.log('Base64 result preview:', result.substring(0, 100) + '...')
        resolve(result)
      }
      reader.onerror = error => {
        console.error('FileReader error:', error)
        reject(error)
      }
    })
  }

  // Manejar selección de archivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileSelect triggered')
    const file = e.target.files?.[0]
    console.log('Selected file:', file)

    if (!file) {
      console.log('No file selected')
      return
    }

    // Validar que sea un archivo PDF
    const extension = getFileExtension(file.name)
    console.log('File extension:', extension)
    console.log('File type:', file.type)

    if (extension !== 'pdf' && file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF')
      return
    }

    // Validar tamaño máximo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Tamaño máximo: 10MB')
      return
    }

    console.log('File passed validations')

    try {
      const extension = getFileExtension(file.name)
      const fileType = getFileType(file)
      console.log('File info - extension:', extension, 'type:', fileType)

      const fileAttachment: FileAttachment = {
        name: file.name,
        size: file.size,
        type: fileType,
        extension: extension
      }
      console.log('Created fileAttachment object:', fileAttachment)

      // Convertir archivo a base64 para n8n (todos los archivos)
      console.log('Converting file to base64...')
      try {
        fileAttachment.data = await fileToBase64(file)
        console.log('Base64 conversion completed, length:', fileAttachment.data?.length)
        console.log('Base64 preview:', fileAttachment.data?.substring(0, 50) + '...')
      } catch (base64Error) {
        console.error('Base64 conversion failed:', base64Error)
        alert('Error al convertir el archivo a base64')
        return
      }

      setSelectedFile(fileAttachment)
      console.log('File set in state:', fileAttachment)

      // El archivo se enviará a n8n cuando se envíe el mensaje
      console.log('Archivo seleccionado para enviar a n8n:', fileAttachment)
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

  // Manejar grabación de voz completada
  const handleVoiceRecordingComplete = async (audioBlob: Blob, duration: number) => {
    try {
      // Convertir audio a base64
      const audioBase64 = await fileToBase64(new File([audioBlob], `voice_${Date.now()}.webm`, { type: 'audio/webm' }))

      const voiceAttachment: FileAttachment = {
        name: `voice_${Date.now()}.webm`,
        size: audioBlob.size,
        type: 'audio',
        extension: 'webm',
        data: audioBase64,
        duration: duration
      }

      // Enviar automáticamente cuando termine la grabación
      onSendMessage('🎤 Mensaje de voz', voiceAttachment)
    } catch (error) {
      console.error('Error processing voice recording:', error)
      alert('Error al procesar la grabación de voz')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('=== HANDLE SUBMIT DEBUG ===')
    console.log('selectedFile state:', selectedFile)
    console.log('message:', message.trim())
    console.log('disabled:', disabled)

    // Debe haber mensaje O archivo para enviar
    const hasMessage = message.trim().length > 0
    const hasFile = selectedFile !== null

    console.log('hasMessage:', hasMessage)
    console.log('hasFile:', hasFile)

    if ((hasMessage || hasFile) && !disabled) {
      // Determinar el mensaje a enviar
      let messageToSend = ''
      if (hasMessage && hasFile) {
        messageToSend = message.trim() // Mensaje del usuario + archivo
      } else if (hasMessage) {
        messageToSend = message.trim() // Solo mensaje
      } else if (hasFile) {
        messageToSend = `He adjuntado el archivo: ${selectedFile.name}` // Solo archivo
      }

      console.log('Sending message:', messageToSend)
      console.log('Sending file:', selectedFile)

      onSendMessage(messageToSend, selectedFile || undefined)

      // Limpiar estado
      setMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else {
      console.log('Submit blocked - no message and no file')
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

  // Debug useEffect para monitorear selectedFile
  useEffect(() => {
    console.log('=== selectedFile CHANGED ===')
    console.log('New selectedFile value:', selectedFile)
    if (selectedFile) {
      console.log('File details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        extension: selectedFile.extension,
        hasData: !!selectedFile.data,
        dataLength: selectedFile.data?.length
      })
    }
  }, [selectedFile])

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
              accept=".pdf,application/pdf"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-primary transition-colors duration-200"
              disabled={disabled}
              title="Adjuntar archivo PDF"
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

            {/* Voice Recorder */}
            <VoiceRecorder
              onRecordingComplete={handleVoiceRecordingComplete}
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