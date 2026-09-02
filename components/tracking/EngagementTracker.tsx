'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

const TIME_MILESTONES = [15, 30, 60] as const
const SCROLL_MILESTONES = [25, 50, 75, 90] as const

export function EngagementTracker() {
  useEffect(() => {
    let activeSeconds = 0
    const firedTimes = new Set<number>()
    const firedDepths = new Set<number>()

    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      activeSeconds += 1

      for (const seconds of TIME_MILESTONES) {
        if (activeSeconds >= seconds && !firedTimes.has(seconds)) {
          firedTimes.add(seconds)
          trackEvent('panther_engaged_time', {
            engagement_seconds: seconds,
            audience_signal: `engaged_${seconds}s`,
          })
        }
      }
    }, 1000)

    const measureScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const depth = Math.min(100, Math.round((window.scrollY / scrollable) * 100))

      for (const percent of SCROLL_MILESTONES) {
        if (depth >= percent && !firedDepths.has(percent)) {
          firedDepths.add(percent)
          trackEvent('panther_scroll_depth', {
            scroll_percent: percent,
            audience_signal: `scroll_${percent}`,
          })
        }
      }
    }

    window.addEventListener('scroll', measureScroll, { passive: true })
    measureScroll()

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('scroll', measureScroll)
    }
  }, [])

  return null
}
