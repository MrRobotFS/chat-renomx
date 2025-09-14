import { Wind, Lightbulb, Zap, Leaf } from 'lucide-react'
import Image from 'next/image'

interface EmptyStateProps {
  onSendMessage?: (message: string) => void
}

export function EmptyState({ onSendMessage }: EmptyStateProps) {
  const suggestions = [
    {
      icon: Wind,
      title: 'Energía Eólica',
      description: '¿Cómo funcionan las turbinas eólicas?'
    },
    {
      icon: Zap,
      title: 'Energía Solar',
      description: 'Ventajas de los paneles fotovoltaicos'
    },
    {
      icon: Leaf,
      title: 'Sostenibilidad',
      description: 'Beneficios de las energías renovables'
    },
    {
      icon: Lightbulb,
      title: 'Eficiencia',
      description: 'Optimización del consumo energético'
    }
  ]

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 p-3 shadow-lg">
          <Image 
            src="/renovables-logo.png" 
            alt="Renovables del Sur MX" 
            width={72}
            height={72}
            className="object-contain"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Hola! Soy Renobot, tu asistente de Renovables del Sur México
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Estoy aquí para ayudarte con información sobre energías renovables, 
          nuestros proyectos y soluciones sostenibles. ¿En qué puedo asistirte hoy?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage?.(suggestion.description)}
              className="p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 dark:bg-primary-900 text-primary rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                  <suggestion.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}