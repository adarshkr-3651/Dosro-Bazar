"use client"

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useAuth } from '../context/AuthContext'

export function ThemeSync() {
  const { user } = useAuth()
  const { setTheme } = useTheme()
  const hasSyncedRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Only sync theme when:
    // 1. User data is first loaded (hasSyncedRef is false)
    // 2. A different user logs in (userId changed)
    // This prevents overriding manual theme changes during the same session
    
    if (user?.theme && user?._id) {
      const currentUserId = user._id.toString()
      
      // If this is a new user or first time syncing, apply their theme preference
      if (!hasSyncedRef.current || lastUserIdRef.current !== currentUserId) {
        setTheme(user.theme)
        hasSyncedRef.current = true
        lastUserIdRef.current = currentUserId
      }
    } else if (!user) {
      // User logged out - force light theme and reset sync flag
      setTheme('light')
      hasSyncedRef.current = false
      lastUserIdRef.current = null
    }
  }, [user?._id, user?.theme, setTheme])

  return null // This component doesn't render anything
}

