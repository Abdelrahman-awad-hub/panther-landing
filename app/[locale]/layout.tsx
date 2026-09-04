import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { routing } from '@/i18n/routing'
import { GtmPageview } from '@/components/gtm-pageview'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata: Metadata = {
  metadataBase: new URL('https://landing.panther-express.com'),
  title: 'Panther Express — Ship Faster, Grow Bigger',
  description: "Egypt's trusted logistics partner for e-commerce brands and growing merchants.",
  icons: { icon: '/favicon.svg' },
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const gtmBootstrap = gtmId
    ? `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`
    : ''

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>
        {gtmId && (
          <Script id="panther-gtm" strategy="afterInteractive">
            {gtmBootstrap}
          </Script>
        )}
        <NextIntlClientProvider messages={messages}>
          <GtmPageview />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
