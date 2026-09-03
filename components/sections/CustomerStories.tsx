'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { trackEvent } from '@/lib/analytics'

const stories = [
  { id: '10NV1YA__gWDBRa1Z64kTFEM6yyFf6Mrc', labelKey: 'story0' },
  { id: '1ZgqbKieEnqwQ0fizgYq4ti00sikzN2Y9', labelKey: 'story1' },
  { id: '1bnnK7e13as7YyZnaPB1Qhg0sUT4U78EM', labelKey: 'story2' },
  { id: '1iK_3I7hWQK_yYEAc2iWBrqhoOXv_mQnC', labelKey: 'story3' },
] as const

export function CustomerStoriesSection() {
  const t = useTranslations('customerStories')
  const [activeStory, setActiveStory] = useState<string | null>(null)

  const playStory = (story: (typeof stories)[number]) => {
    setActiveStory(story.id)
    trackEvent('customer_story_play', {
      story_id: story.id,
      story_name: t(story.labelKey),
      audience_signal: 'testimonial_viewer',
    })
  }

  return (
    <section className="bg-zinc-50 py-12 sm:py-20" aria-labelledby="customer-stories-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-panther-red">
            {t('badge')}
          </p>
          <h2 id="customer-stories-title" className="text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">{t('subtitle')}</p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {stories.map((story) => (
            <article key={story.id} className="w-[82vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-sm">
                {activeStory === story.id ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${story.id}/preview?autoplay=1`}
                    title={`${t('videoTitle')} — ${t(story.labelKey)}`}
                    loading="lazy"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="aspect-[9/16] w-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => playStory(story)}
                    className="group flex aspect-[9/16] w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-zinc-800 to-zinc-950 px-5 text-white"
                    aria-label={`${t('play')} — ${t(story.labelKey)}`}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-panther-red shadow-lg transition-transform group-hover:scale-105">
                      <Play className="ms-1 h-7 w-7 fill-current" aria-hidden="true" />
                    </span>
                    <span className="text-base font-extrabold">{t('play')}</span>
                  </button>
                )}
              </div>
              <p className="mt-3 text-center text-sm font-bold text-zinc-900">{t(story.labelKey)}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-zinc-500 sm:hidden">{t('swipeHint')}</p>
      </div>
    </section>
  )
}
