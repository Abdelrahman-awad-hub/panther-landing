'use client'

import { useTranslations, useLocale } from 'next-intl'
import type { TrackEvent } from '@/lib/track-schema'
import { STAGE_ICON, stageTone, TONE_CLASSES } from './stage-visual'
import { cn } from '@/lib/utils'

interface StatusTimelineProps {
  events: TrackEvent[]
}

/** Chronological list of customer-relevant events, newest first. */
export function StatusTimeline({ events }: StatusTimelineProps) {
  const t = useTranslations('track')
  const tStages = useTranslations('track.stages')
  const isAr = useLocale() === 'ar'

  return (
    <ol className="relative">
      {events.map((ev, i) => {
        const tone = stageTone(ev.stage)
        const c = TONE_CLASSES[tone]
        const Icon = STAGE_ICON[ev.stage]
        const isLast = i === events.length - 1
        const isFirst = i === 0
        const note = isAr ? ev.noteAr || ev.noteEn : ev.noteEn || ev.noteAr

        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-9 bottom-0 w-px bg-gray-200"
                style={{ insetInlineStart: '17px' }}
              />
            )}

            {/* Dot */}
            <span
              className={cn(
                'relative z-10 flex items-center justify-center w-9 h-9 rounded-full ring-4 ring-white shrink-0',
                c.bg,
              )}
            >
              <Icon size={16} className={c.text} strokeWidth={2.2} />
            </span>

            <div className="pt-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-semibold',
                  isFirst ? 'text-panther-black' : 'text-gray-700',
                )}
              >
                {tStages(ev.stage)}
              </p>
              {ev.date && (
                <p className="text-xs text-gray-400 mt-0.5" dir="ltr">
                  {ev.date}
                </p>
              )}
              {note && (
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  <span className="text-gray-400">{t('reasonLabel')}: </span>
                  {note}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
