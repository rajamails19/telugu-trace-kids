import { useState, useEffect, useRef, useCallback } from 'react'

export const TOTAL_DASH = 14000

const DURATIONS = { slow: 26000, medium: 11000, fast: 4500 }

export function useTracing({ speed = 'slow', autoReplay = true, onComplete } = {}) {
  const [offset, setOffset] = useState(TOTAL_DASH)
  const [phase, setPhase] = useState('idle') // idle | animating | done
  const rafRef = useRef(null)
  const timeoutRef = useRef(null)
  const startRef = useRef(null)
  const speedRef = useRef(speed)
  speedRef.current = speed

  const cancel = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const start = useCallback(() => {
    cancel()
    setOffset(TOTAL_DASH)
    setPhase('idle')

    timeoutRef.current = setTimeout(() => {
      setPhase('animating')
      startRef.current = performance.now()
      const duration = DURATIONS[speedRef.current] ?? DURATIONS.slow

      const tick = (now) => {
        const elapsed = now - startRef.current
        const t = Math.min(elapsed / duration, 1)
        setOffset(TOTAL_DASH * (1 - t))

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setPhase('done')
          onComplete?.()
          if (autoReplay) {
            timeoutRef.current = setTimeout(start, 2000)
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, 300)
  }, [autoReplay, cancel, onComplete])

  useEffect(() => {
    start()
    return cancel
  }, [speed]) // restart when speed changes

  const replay = useCallback(() => start(), [start])
  const progress = 1 - offset / TOTAL_DASH

  return { offset, phase, progress, replay }
}
