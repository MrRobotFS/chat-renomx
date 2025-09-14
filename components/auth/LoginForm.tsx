'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/chatApi'
import { LoginRequest, User } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LoginFormProps {
  onLoginSuccess: (user: User, token: string) => void
  onLoginError: (error: string) => void
  onInputChange?: () => void
}

export default function LoginForm({ onLoginSuccess, onLoginError, onInputChange }: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginRequest>({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    onInputChange?.()

    try {
      const response = await apiClient.login(credentials)
      if (response.success) {
        onLoginSuccess(response.user, response.access)
      } else {
        onLoginError('Invalid credentials')
      }
    } catch (error) {
      console.error('Login failed:', error)
      onLoginError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onInputChange?.()
    setCredentials(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Usuario o Correo
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username email"
            required
            placeholder="usuario@empresa.com"
            value={credentials.username}
            onChange={handleInputChange('username')}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleInputChange('password')}
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !credentials.username || !credentials.password}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}