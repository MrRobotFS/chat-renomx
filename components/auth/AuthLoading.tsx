'use client'

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Verificando autenticación...
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Un momento por favor
        </p>
      </div>
    </div>
  )
}