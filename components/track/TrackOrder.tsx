'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { sendGTMEvent } from '@next/third-parties/google'
import { Search, AlertCircle, Loader2, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TrackResult } from '@/lib/track-schema'
import { isExceptionStage } from '@/lib/track-status-map'
import { StatusStepper } from './StatusStepper'
import { StatusTimeline } from './StatusTimeline'
import { STAGE_ICON, stageTone, TONE_CLASSES } from './stage-visual'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'loading' | 'found' | 'invalid' | 'not_found' | 'rate_limited' | 'error'

const ERROR_PHASE: Record<number, Phase> = {
  400: 'invalid',
  404: 'not_found',
  429: 'rate_limited',
}

export function TrackOrder() {
  const t = useTranslations('track')
  const tStages = useTranslations('track.stages')
  const tHint = useTranslations('track.stageHint')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const searchParams = useSearchParams()

  const [waybill, setWaybill] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<TrackResult | null>(null)

  const track = useCallback(async (raw: string) => {
    const value = raw.trim()
    if (value.length < 3) {
      setPhase('invalid')
      return
    }
    setPhase('loading')
    sendGTMEvent({ event: 'track_search' })
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waybill: value }),
      })
      if (res.ok) {
        const data = (await res.json()) as TrackResult
        setResult(data)
        setPhase('found')
        sendGTMEvent({ event: 'track_result', track_status: data.currentStage })
        return
      }
      setPhase(ERROR_PHASE[res.status] ?? 'error')
    } catch {
      setPhase('error')
    }
  }, [])

  // Deep-link support: ?waybill=WY154830 pre-fills and auto-tracks.
  const autoRan = useRef(false)
  useEffect(() => {
    if (autoRan.current) return
    const deep = searchParams.get('waybill')
    if (deep) {
      autoRan.current = true
      setWaybill(deep)
      void track(deep)
    }
  }, [searchParams, track])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void track(waybill)
  }

  return (
    <>
      {/* Search hero */}
      <section className="relative bg-panther-black pt-28 lg:pt-32 pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#E5001A 1px, transparent 1px), linear-gradient(90deg, #E5001A 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
          <div className="absolute -top-24 -end-48 w-[420px] h-[420px] bg-panther-red/6 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-6">
            <PackageSearch size={13} className="text-panther-red" />
            <span className="text-panther-red text-sm font-medium">{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-white/55 leading-relaxed mb-9 max-w-xl mx-auto">
            {t('subtitle')}
          </p>

          <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute top-1/2 -translate-y-1/2 start-3.5 text-gray-400 pointer-events-none"
              />
              <Input
                dir="ltr"
                value={waybill}
                onChange={(e) => setWaybill(e.target.value)}
                placeholder={t('inputPlaceholder')}
                aria-label={t('waybillLabel')}
                className={cn(
                  'h-12 bg-white border-0 rounded-xl text-gray-900 placeholder:text-gray-400',
                  'ps-11 pe-4 text-base w-full',
                  'focus-visible:ring-2 focus-visible:ring-panther-red/40',
                  isAr && 'text-right',
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={phase === 'loading'}
              className="h-12 px-7 bg-panther-red hover:bg-panther-red-dark text-white font-bold rounded-xl text-base disabled:opacity-60 shrink-0"
            >
              {phase === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin me-2" />
                  {t('searching')}
                </>
              ) : (
                t('button')
              )}
            </Button>
          </form>

          {phase === 'invalid' && (
            <p className="text-panther-red-light text-sm mt-4">{t('invalidMsg')}</p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="bg-gray-50 min-h-[40vh] py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {phase === 'found' && result && <Result result={result} />}

          {phase === 'not_found' && (
            <StateCard
              title={t('notFoundTitle')}
              desc={t('notFoundDesc')}
              tone="warning"
            />
          )}
          {phase === 'rate_limited' && (
            <StateCard
              title={t('rateLimitedTitle')}
              desc={t('rateLimitedDesc')}
              tone="warning"
            />
          )}
          {phase === 'error' && (
            <StateCard title={t('errorTitle')} desc={t('errorDesc')} tone="danger" />
          )}
        </div>
      </section>
    </>
  )

  function Result({ result }: { result: TrackResult }) {
    const exception = isExceptionStage(result.currentStage)
    const tone = stageTone(result.currentStage)
    const c = TONE_CLASSES[tone]
    const Icon = STAGE_ICON[result.currentStage]
    const lastDate = result.events[0]?.date

    return (
      <div className="space-y-6 animate-fade-up">
        {/* Summary card */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {t('waybillLabel')}
              </p>
              <p className="text-lg font-bold text-panther-black mt-0.5" dir="ltr">
                {result.waybill}
              </p>
            </div>
            <div
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1',
                c.bg,
                c.ring,
              )}
            >
              <Icon size={16} className={c.text} strokeWidth={2.4} />
              <span className={cn('text-sm font-bold', c.text)}>
                {tStages(result.currentStage)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            {tHint(result.currentStage)}
          </p>

          {lastDate && (
            <p className="text-xs text-gray-400 mt-4">
              {t('lastUpdate')}: <span dir="ltr">{lastDate}</span>
            </p>
          )}

          <div className="mt-8 pt-2">
            <StatusStepper
              furthestProgressOrder={result.furthestProgressOrder}
              isException={exception}
              currentStage={result.currentStage}
            />
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 sm:p-8">
          <h2 className="text-base font-bold text-panther-black mb-6">
            {t('historyTitle')}
          </h2>
          <StatusTimeline events={result.events} />
        </div>
      </div>
    )
  }

}

function StateCard({
  title,
  desc,
  tone,
}: {
  title: string
  desc: string
  tone: 'warning' | 'danger'
}) {
  const c = TONE_CLASSES[tone]
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8 sm:p-10 text-center max-w-lg mx-auto animate-fade-up">
      <div
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5',
          c.bg,
        )}
      >
        <AlertCircle size={26} className={c.text} strokeWidth={1.8} />
      </div>
      <h2 className="text-xl font-bold text-panther-black mb-2">{title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
