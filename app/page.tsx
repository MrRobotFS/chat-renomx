'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import AuthLoading from '@/components/auth/AuthLoading'
import { User } from '@/lib/types'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function HomePage() {
  const { user, isAuthenticated, isLoading: authLoading, login } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Redirect to chat if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/chat')
    }
  }, [isAuthenticated, user, router])

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading />
  }

  // If user is already authenticated, show loading while redirecting
  if (isAuthenticated && user) {
    return <AuthLoading />
  }

  const handleLoginError = (error: string) => {
    const errorMessage = error.includes('Authentication failed')
      ? 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.'
      : 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.'
    setError(errorMessage)
  }

  // Show login form if not authenticated
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 p-2 shadow-lg">
              <img 
                src="/renovables-logo.png" 
                alt="Renovables del Sur MX" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Renovables del Sur México
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Accede a Renobot, nuestro asistente inteligente
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Usa tu nombre de usuario o correo electrónico
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <LoginForm
            onLoginSuccess={(user: User, token: string) => {
              login(user, token)
              // Redirect will happen via useEffect
            }}
            onLoginError={handleLoginError}
            onInputChange={() => setError(null)}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Necesitas ayuda? Contacta al administrador
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}