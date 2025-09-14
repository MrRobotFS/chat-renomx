'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/lib/types'
import { apiClient } from '@/lib/chatApi'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async (): Promise<boolean> => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return false
    }
    
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('currentUser')
    
    if (!token || !storedUser) {
      setIsLoading(false)
      return false
    }

    try {
      // Parse stored user data
      const userData = JSON.parse(storedUser)
      
      // Try to verify token with backend
      try {
        const userProfile = await apiClient.getProfile()
        setUser(userProfile)
        // Update stored user data with fresh data
        localStorage.setItem('currentUser', JSON.stringify(userProfile))
      } catch (apiError) {
        console.log('Backend not available, using cached user data')
        // Use cached user data if backend is not available
        setUser(userData)
        apiClient.setToken(token)
      }
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid data
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      apiClient.clearToken()
      setUser(null)
      setIsLoading(false)
      return false
    }
  }

  const login = (user: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
    apiClient.setToken(token)
    setUser(user)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      // Clear conversation data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('conversations_')) {
          localStorage.removeItem(key)
        }
      })
    }
    apiClient.clearToken()
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}