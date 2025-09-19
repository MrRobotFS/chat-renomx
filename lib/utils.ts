// Utility functions for handling different environments

export function getAssetPath(path: string): string {
  // En desarrollo no hay basePath, en producción sí
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    return path
  } else {
    return `/chatbot${path}`
  }
}

export function getApiUrl(endpoint: string): string {
  // En desarrollo no hay basePath, en producción sí
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    return endpoint
  } else {
    return `/chatbot${endpoint}`
  }
}