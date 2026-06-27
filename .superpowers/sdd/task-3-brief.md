### Task 3: Wire GTM into the locale layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `GoogleTagManager` from `@next/third-parties/google`, `GtmPageview` from Task 2, `NEXT_PUBLIC_GTM_ID` env var
- Produces: GTM script loaded on every page; pageview events fired on navigation

- [ ] **Step 1: Update `app/[locale]/layout.tsx`**

Replace the entire file content with the following (the only additions are the two new imports and the two new JSX elements):

```tsx
import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { GoogleTagManager } from '@next/third-parties/google'
import { routing } from '@/i18n/routing'
import { GtmPageview } from '@/components/gtm-pageview'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'Panther Express — Ship Faster, Grow Bigger',
  description: "Egypt's trusted logistics partner for e-commerce brands and growing merchants.",
  icons: { icon: '/panthe-logo.png' },
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

  return (
    <html lang={locale} dir={dir}>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body className={`${inter.variable} ${cairo.variable} antialiased`}>
        <GtmPageview />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and confirm GTM script loads**

```bash
npm run dev
```

Open `http://localhost:3000` in the browser. Open DevTools → Network tab → filter by `gtm.js`. You should see a request to `https://www.googletagmanager.com/gtm.js?id=GTM-637363636`.

Also open DevTools → Console and run:

```js
window.dataLayer
```

Expected: an array with at least one object containing `event: 'pageview'`.

- [ ] **Step 4: Commit**

```bash
git add app/\[locale\]/layout.tsx
git commit -m "feat: add GoogleTagManager and GtmPageview to locale layout"
```

---

