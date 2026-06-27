'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, X } from 'lucide-react'

type Social = {
  key: string
  href: string
  /** brand color used for the hover background */
  color: string
  icon: React.ReactNode
}

const iconClass = 'h-5 w-5'

const SOCIALS: Social[] = [
  {
    key: 'whatsapp',
    href: 'https://wa.me/201070782785',
    color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/panther_express_?igsh=MWRtczY3N29jczlsZg%3D%3D',
    color: '#E1306C',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    href: 'https://www.facebook.com/profile.php?id=100086041746520',
    color: '#1877F2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    href: 'https://www.tiktok.com/@pantherexpress3?_r=1&_t=ZS-97Z3mWT333I',
    color: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    key: 'email',
    href: 'mailto:sales@panther-express.com',
    color: '#CC0016',
    icon: <Mail className={iconClass} aria-hidden="true" />,
  },
]

export function SocialDock() {
  const t = useTranslations('social')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 end-6 z-50 flex flex-col items-center gap-3"
    >
      {/* Social links stack */}
      <ul className="flex flex-col items-center gap-3" role="menu" aria-label={t('label')}>
        {SOCIALS.map((s, i) => (
          <li key={s.key} role="none">
            <a
              role="menuitem"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(s.key)}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                window.dataLayer?.push({ event: 'social_click', platform: s.key })
                setOpen(false)
              }}
              style={{
                // stagger: items closest to the FAB animate in first
                transitionDelay: open ? `${(SOCIALS.length - 1 - i) * 55}ms` : '0ms',
                ['--brand' as string]: s.color,
              }}
              className={[
                'group/item relative grid h-12 w-12 place-items-center rounded-full',
                'bg-panther-surface text-white shadow-lg ring-1 ring-white/10',
                'transition-all duration-300 ease-out motion-reduce:transition-none',
                'hover:bg-[var(--brand)] hover:scale-110 hover:ring-white/30',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-panther-red',
                open
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'pointer-events-none translate-y-4 scale-50 opacity-0',
              ].join(' ')}
            >
              {s.icon}
              {/* Tooltip */}
              <span
                className="pointer-events-none absolute end-full me-3 whitespace-nowrap rounded-md bg-panther-black/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-200 group-hover/item:opacity-100"
              >
                {t(s.key)}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Toggle FAB */}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? t('close') : t('open')}
        onClick={() => setOpen((v) => !v)}
        className={[
          'relative grid h-14 w-14 place-items-center rounded-full',
          'bg-panther-red text-white shadow-xl',
          'transition-transform duration-300 ease-out hover:scale-105 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panther-black',
          'motion-reduce:transition-none',
        ].join(' ')}
      >
        {/* Pulsing attention ring (hidden once open) */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-panther-red opacity-60 motion-safe:animate-ping" aria-hidden="true" />
        )}
        <span
          className={[
            'relative transition-transform duration-300 ease-out motion-reduce:transition-none',
            open ? 'rotate-0' : 'rotate-0',
          ].join(' ')}
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z" />
            </svg>
          )}
        </span>
      </button>
    </div>
  )
}
