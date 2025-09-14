'use client'

import { Menu, ChevronDown } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useState } from 'react'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const [selectedModel, setSelectedModel] = useState('Modelo Rápido')
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)

  const models = ['Modelo Rápido', 'Modelo Avanzado', 'Modelo Especializado']

  return (
    <header className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark rounded-lg transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-dark text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark transition-colors duration-200"
            >
              <span className="text-sm font-medium">{selectedModel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                {models.map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model)
                      setIsModelDropdownOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}