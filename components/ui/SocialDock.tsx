'use client'

import { useLocale, useTranslations } from 'next-intl'
import { trackEvent } from '@/lib/analytics'
import { OFFICIAL_WHATSAPP_URL } from '@/lib/contact'

export function SocialDock() {
  const t = useTranslations('social')
  const locale = useLocale()

  return (
    <a
      href={OFFICIAL_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp')}
      onClick={() => trackEvent('contact_click', {
        contact_method: 'whatsapp',
        contact_location: 'floating_whatsapp',
        link_url: OFFICIAL_WHATSAPP_URL,
        language: locale,
      })}
      className="group fixed bottom-6 end-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl ring-1 ring-black/5 transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 motion-safe:animate-ping" aria-hidden="true" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
      </svg>
      <span className="pointer-events-none absolute end-full me-3 whitespace-nowrap rounded-md bg-panther-black/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {t('whatsapp')}
      </span>
    </a>
  )
}
