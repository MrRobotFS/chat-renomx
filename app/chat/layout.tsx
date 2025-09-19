'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/chat/Sidebar'
import { Header } from '@/components/chat/Header'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/contexts/AuthContext'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { 
    conversations, 
    currentConversation, 
    createConversation, 
    selectConversation, 
    deleteConversation
  } = useChat()

  const handleNewConversation = () => {
    createConversation()
  }
  
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        conversations={conversations}
        currentConversationId={currentConversation?.id || null}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        user={user}
        onLogout={logout}
      />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeSidebar}
        />
      )}

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isSidebarOpen ? 'md:ml-0' : 'md:ml-0'
      }`}>
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}