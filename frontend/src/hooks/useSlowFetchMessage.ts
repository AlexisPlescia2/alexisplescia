import { useState, useEffect } from 'react'

/**
 * Returns true if `loading` is still true after `thresholdMs` milliseconds.
 * Resets to false immediately when loading becomes false.
 */
export function useSlowFetchMessage(loading: boolean, thresholdMs = 3000): boolean {
  const [isSlowFetch, setIsSlowFetch] = useState(false)

  useEffect(() => {
    if (!loading) {
      setIsSlowFetch(false)
      return
    }

    const timer = setTimeout(() => {
      setIsSlowFetch(true)
    }, thresholdMs)

    return () => clearTimeout(timer)
  }, [loading, thresholdMs])

  return isSlowFetch
}
