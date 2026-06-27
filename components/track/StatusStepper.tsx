'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { PROGRESS_STAGES, type Stage } from '@/lib/track-status-map'
import { STAGE_ICON } from './stage-visual'
import { cn } from '@/lib/utils'

interface StatusStepperProps {
  /** Furthest happy-path milestone reached, 0–4. */
  furthestProgressOrder: number
  /** True when the shipment is in an exception state (failed/returned/etc.). */
  isException: boolean
  currentStage: Stage
}

/**
 * Horizontal (desktop) / vertical (mobile) progress stepper of the four
 * happy-path milestones. In an exception state the reached steps are shown
 * muted (no misleading green) — a banner above communicates the real state.
 */
export function StatusStepper({
  furthestProgressOrder,
  isException,
  currentStage,
}: StatusStepperProps) {
  const t = useTranslations('track.stages')
  const delivered = currentStage === 'DELIVERED'

  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {PROGRESS_STAGES.map((stage, i) => {
        const order = i + 1
        const reached = order <= furthestProgressOrder
        const isCurrent =
          order === furthestProgressOrder && !delivered && !isException
        const done = reached && (order < furthestProgressOrder || delivered)
        const Icon = STAGE_ICON[stage]
        const isLast = i === PROGRESS_STAGES.length - 1

        // Connector (to the next node) is green only when the next leg is
        // reached on a healthy happy path.
        const legReached = !isException && order < furthestProgressOrder
        const connector = legReached ? 'bg-emerald-500' : 'bg-gray-200'

        const node =
          isException && reached
            ? 'bg-gray-200 text-gray-500 ring-gray-200'
            : done
              ? 'bg-emerald-500 text-white ring-emerald-500'
              : isCurrent
                ? 'bg-panther-red text-white ring-panther-red'
                : 'bg-white text-gray-300 ring-gray-200'

        const label =
          isException && reached
            ? 'text-gray-400'
            : done
              ? 'text-emerald-700'
              : isCurrent
                ? 'text-panther-black font-semibold'
                : 'text-gray-400'

        return (
          <li
            key={stage}
            className={cn(
              'relative flex items-center sm:flex-col sm:items-center sm:text-center',
              !isLast && 'sm:flex-1',
            )}
          >
            {/* Desktop connector: from this node's centre to the next node's centre */}
            {!isLast && (
              <span
                aria-hidden
                className={cn('hidden sm:block absolute top-5 h-0.5', connector)}
                style={{ insetInlineStart: '50%', width: '100%' }}
              />
            )}

            {/* Node */}
            <span
              className={cn(
                'relative z-10 flex items-center justify-center w-10 h-10 rounded-full ring-2 shrink-0 transition-colors',
                node,
                isCurrent && 'shadow-[0_0_0_4px_rgba(204,0,22,0.12)]',
              )}
            >
              {done ? (
                <Check size={18} strokeWidth={3} />
              ) : (
                <Icon size={18} strokeWidth={2} />
              )}
            </span>

            {/* Mobile vertical connector */}
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'sm:hidden absolute top-10 bottom-0 w-0.5',
                  connector,
                )}
                style={{ insetInlineStart: '19px' }}
              />
            )}

            <span
              className={cn(
                'text-sm font-medium leading-tight ms-3 sm:ms-0 sm:mt-2.5 py-3 sm:py-0',
                label,
              )}
            >
              {t(stage)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
