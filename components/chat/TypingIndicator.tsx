import { getAssetPath } from '@/lib/utils'

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6 group">
      <div className="flex items-start space-x-3 max-w-[85%] md:max-w-[75%]">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-dark rounded-full flex items-center justify-center p-1 shadow-sm">
          <img 
            src={getAssetPath('/renovables-logo.png')} 
            alt="Renobot" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Typing Animation */}
        <div className="flex flex-col space-y-1 items-start">
          <div className="bg-white dark:bg-dark text-gray-900 dark:text-white rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Renobot está escribiendo</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
          
          {/* Timestamp */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}