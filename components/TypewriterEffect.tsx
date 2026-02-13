'use client'

import { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenTexts?: number
}

export default function TypewriterEffect({ 
  texts, 
  typingSpeed = 100,
  deletingSpeed = 50, 
  delayBetweenTexts = 2000 
}: TypewriterEffectProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter out empty/null/undefined texts
  const validTexts = texts?.filter(t => t && t.trim()) || []

  useEffect(() => {
    // Handle empty or invalid texts array
    if (validTexts.length === 0) {
      return
    }

    const targetText = validTexts[currentTextIndex]
    if (!targetText) return

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < targetText.length) {
          setCurrentText(targetText.slice(0, currentText.length + 1))
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), delayBetweenTexts)
        }
      } else {
        // Deleting backward
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false)
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % validTexts.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, validTexts, typingSpeed, deletingSpeed, delayBetweenTexts])

  // Don't render if no valid texts
  if (!texts || texts.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-2xl text-gray-300">{'>'}</span>
      <span className="text-2xl font-semibold text-primary">
        {currentText}
        <span className="animate-pulse">_</span>
      </span>
    </div>
  )
}
