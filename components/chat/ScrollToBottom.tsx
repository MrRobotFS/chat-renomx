'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ScrollToBottomProps {
  containerRef: React.RefObject<HTMLDivElement>
  messagesCount: number
}

export function ScrollToBottom({ containerRef, messagesCount }: ScrollToBottomProps) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      
      // Show button if user is more than 100px from bottom
      setShowButton(distanceFromBottom > 100)
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => container.removeEventListener('scroll', handleScroll)
  }, [containerRef])

  const scrollToBottom = () => {
    const container = containerRef.current
    if (!container) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    })
  }

  if (!showButton) return null

  return (
    <div className="absolute bottom-4 right-4 z-10">
      <button
        onClick={scrollToBottom}
        className="flex items-center justify-center w-12 h-12 bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        title="Ir al final de la conversación"
      >
        <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  )
}