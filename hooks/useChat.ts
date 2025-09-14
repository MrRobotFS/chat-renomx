'use client'

import { useState, useEffect, useCallback } from 'react'
import { Conversation, Message, FileAttachment } from '@/lib/types'
import { apiClient } from '@/lib/chatApi'
import { useAuth } from '@/contexts/AuthContext'

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
}

export function useChat() {
  const { user, isAuthenticated } = useAuth()
  const [state, setState] = useState<ChatState>({
    conversations: [],
    currentConversationId: null,
    isLoading: false
  })

  // Load conversations when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations()
    } else {
      // Clear conversations when not authenticated
      setState(prev => ({
        ...prev,
        conversations: [],
        currentConversationId: null
      }))
    }
  }, [isAuthenticated, user])

  // Save conversations to localStorage and sessionStorage when they change
  useEffect(() => {
    if (isAuthenticated && user && typeof window !== 'undefined') {
      const storageKey = `conversations_${user.employee.id}`
      const sessionKey = `session_conversations_${user.employee.id}`
      
      if (state.conversations.length > 0) {
        try {
          // Filter out conversations without messages to avoid saving empty ones
          const conversationsToSave = state.conversations.filter(conv => 
            conv.messages && conv.messages.length > 0
          )
          
          // If there are conversations with messages, save them
          if (conversationsToSave.length > 0) {
            const conversationsJson = JSON.stringify(conversationsToSave)
            localStorage.setItem(storageKey, conversationsJson)
            sessionStorage.setItem(sessionKey, conversationsJson)
          }
        } catch (error) {
          console.error('Failed to save conversations:', error)
        }
      }
    } else if (!isAuthenticated && typeof window !== 'undefined') {
      // Clear storage when not authenticated
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('conversations_') || key.startsWith('session_conversations_')) {
          localStorage.removeItem(key)
        }
      })
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('conversations_') || key.startsWith('session_conversations_')) {
          sessionStorage.removeItem(key)
        }
      })
    }
  }, [state.conversations, isAuthenticated, user])

  const loadConversations = useCallback(async () => {
    if (!isAuthenticated || !user) return
    
    try {
      const storageKey = `conversations_${user.employee.id}`
      const sessionKey = `session_conversations_${user.employee.id}`
      
      // Try localStorage first, then sessionStorage
      let storedConversations = null
      if (typeof window !== 'undefined') {
        storedConversations = localStorage.getItem(storageKey) || sessionStorage.getItem(sessionKey)
      }
      
      if (storedConversations) {
        try {
          const storedConvsArray = JSON.parse(storedConversations)
          // Validate the data structure
          if (Array.isArray(storedConvsArray)) {
            // Merge with current conversations (in case there are new empty ones)
            setState(prev => {
              const storedIds = storedConvsArray.map(c => c.id)
              
              // Keep existing conversations that have messages or don't exist in storage
              const mergedConversations = [
                ...storedConvsArray,
                ...prev.conversations.filter(conv => 
                  !storedIds.includes(conv.id) && (!conv.messages || conv.messages.length === 0)
                )
              ]
              
              return { ...prev, conversations: mergedConversations }
            })
            
            // Sync to both storages
            localStorage.setItem(storageKey, JSON.stringify(storedConvsArray))
            sessionStorage.setItem(sessionKey, JSON.stringify(storedConvsArray))
            return
          }
        } catch (parseError) {
          console.error('Failed to parse stored conversations:', parseError)
        }
      }

      // If no valid local conversations, try backend
      try {
        const conversations = await apiClient.getConversations()
        setState(prev => ({ ...prev, conversations }))
        // Store fetched conversations
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(conversations))
          sessionStorage.setItem(sessionKey, JSON.stringify(conversations))
        }
      } catch (error) {
        console.log('Backend not available, starting with empty conversations')
        setState(prev => ({ ...prev, conversations: [] }))
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
      setState(prev => ({ ...prev, conversations: [] }))
    }
  }, [isAuthenticated, user])

  const createConversation = useCallback(async (title?: string) => {
    if (!isAuthenticated || !user) return null
    
    try {
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        employee: user.employee,
        title: title || 'Nueva conversación',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        messages: [],
      };
      
      setState(prev => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        currentConversationId: newConversation.id
      }))
      
      return newConversation
    } catch (error) {
      console.error('Failed to create conversation:', error)
      return null
    }
  }, [isAuthenticated, user])

  const selectConversation = useCallback(async (conversationId: string) => {
    setState(prev => {
      // Check if the conversation exists in current state
      const existsInState = prev.conversations.some(conv => conv.id === conversationId)
      
      if (!existsInState && user) {
        // Try to load from storage if conversation is not in current state
        const storageKey = `conversations_${user.employee.id}`
        const storedConversations = localStorage.getItem(storageKey)
        
        if (storedConversations) {
          try {
            const storedConvsArray = JSON.parse(storedConversations)
            const missingConversation = storedConvsArray.find((conv: Conversation) => conv.id === conversationId)
            
            if (missingConversation) {
              return {
                ...prev,
                conversations: [missingConversation, ...prev.conversations],
                currentConversationId: conversationId
              }
            }
          } catch (error) {
            console.error('Error parsing stored conversations:', error)
          }
        }
      }
      
      return { 
        ...prev, 
        currentConversationId: conversationId 
      }
    })
  }, [user])

  const deleteConversationById = useCallback(async (conversationId: string) => {
    if (!isAuthenticated) return
    
    try {
      // Update local state to remove the conversation
      setState(prev => ({
        ...prev,
        conversations: prev.conversations.filter(conv => conv.id !== conversationId),
        currentConversationId: prev.currentConversationId === conversationId ? null : prev.currentConversationId
      }))
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }, [isAuthenticated])

  const sendMessage = useCallback(async (content: string, file?: FileAttachment) => {
    if (!user || !isAuthenticated) return;

    setState(prev => ({ ...prev, isLoading: true }));

    // Create user message immediately for UI
    const userMessage: Message = {
      id: Date.now() + Math.random(), // Make sure ID is unique
      content: content,
      is_user: true,
      timestamp: new Date().toISOString(),
      has_file: !!file,
      file: file,
    };

    // Update UI with user message first
    const conversationId = state.currentConversationId || crypto.randomUUID();
    
    setState(prev => {
      const existingConversation = prev.conversations.find(conv => conv.id === conversationId);

      if (existingConversation) {
        // Update existing conversation immutably
        const updatedConversations = prev.conversations.map(conv => 
          conv.id === conversationId 
            ? {
                ...conv,
                messages: [...(conv.messages || []), userMessage],
                updated_at: new Date().toISOString()
              }
            : conv
        );

        return {
          ...prev,
          conversations: updatedConversations,
          currentConversationId: conversationId,
        };
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          id: conversationId,
          employee: user.employee,
          title: content.length > 50 ? content.substring(0, 50) + "..." : content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          messages: [userMessage],
        };

        return {
          ...prev,
          conversations: [newConversation, ...prev.conversations],
          currentConversationId: conversationId,
        };
      }
    });

    try {
      const response = await apiClient.sendMessage({
        message: content,
        conversation_id: conversationId,
        file: file,
        has_file: !!file
      }, user);

      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + Math.random() + 1000, // Make sure AI message ID is unique
        content: response.ai_response.content,
        is_user: false,
        timestamp: new Date().toISOString(),
        has_file: false,
      };

      setState(prev => {
        const updatedConversations = prev.conversations.map(conv => 
          conv.id === conversationId 
            ? {
                ...conv,
                messages: [...(conv.messages || []), aiMessage],
                updated_at: new Date().toISOString()
              }
            : conv
        );

        return {
          ...prev,
          conversations: updatedConversations,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.currentConversationId, user, isAuthenticated]);

  const getCurrentConversation = useCallback(() => {
    if (!state.currentConversationId) return null
    return state.conversations.find(conv => conv.id === state.currentConversationId) || null
  }, [state.conversations, state.currentConversationId])

  const uploadFile = useCallback(async (file: File) => {
    if (!state.currentConversationId) return null

    try {
      const response = await apiClient.uploadFile(state.currentConversationId, file)
      await loadConversations() // Reload to show the uploaded file
      return response
    } catch (error) {
      console.error('Failed to upload file:', error)
      return null
    }
  }, [state.currentConversationId, loadConversations])

  return {
    conversations: state.conversations,
    currentConversation: getCurrentConversation(),
    isLoading: state.isLoading,
    user,
    createConversation,
    selectConversation,
    deleteConversation: deleteConversationById,
    sendMessage,
    uploadFile,
    loadConversations,
    // Debug function
    debugState: () => {
      console.log('Current state:', state)
      console.log('LocalStorage conversations:', user ? localStorage.getItem(`conversations_${user.employee.id}`) : 'No user')
    }
  }
}