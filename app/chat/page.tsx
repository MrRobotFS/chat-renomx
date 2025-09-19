'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { EmptyState } from '@/components/chat/EmptyState'
import { ScrollToBottom } from '@/components/chat/ScrollToBottom'
import { useChat } from '@/hooks/useChat'
import { FileAttachment } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import AuthLoading from '@/components/auth/AuthLoading'

export default function ChatPage() {
  const { currentConversation, isLoading, sendMessage } = useChat()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user)) {
      router.push('/')
    }
  }, [isAuthenticated, user, authLoading, router])

  // Auto-scroll to bottom when new messages arrive or typing starts
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100) // Small delay to ensure DOM is updated

    return () => clearTimeout(timeoutId)
  }, [currentConversation?.messages, isLoading])

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading />
  }

  // If user is not logged in, show loading while redirecting
  if (!isAuthenticated || !user) {
    return <AuthLoading />
  }

  const handleSendMessage = async (content: string, file?: FileAttachment) => {
    console.log('=== HANDLE SEND MESSAGE IN PAGE ===')
    console.log('Content:', content)
    console.log('File:', file)
    await sendMessage(content, file)
  }

  const messages = currentConversation?.messages || []

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-dark">
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        {messages.length === 0 ? (
          <EmptyState onSendMessage={handleSendMessage} />
        ) : (
          <div className="p-4 pb-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {/* Scroll to Bottom Button */}
        <ScrollToBottom 
          containerRef={messagesContainerRef}
          messagesCount={messages.length}
        />
      </div>
      
      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  )
}