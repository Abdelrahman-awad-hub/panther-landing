# GTM Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Google Tag Manager (`GTM-637363636`) into the Next.js 14 App Router landing page, with a route-change pageview pusher and a `form_submit` dataLayer event on lead form success.

**Architecture:** Install `@next/third-parties`, add `<GoogleTagManager>` to the locale layout, mount a client component that pushes `pageview` events on every pathname change, and push a `form_submit` event inside `LeadForm` on successful API response.

**Tech Stack:** Next.js 14 App Router, `@next/third-parties/google`, `next/navigation` `usePathname`, TypeScript

## Global Constraints

- GTM Container ID: `GTM-637363636` (stored in `NEXT_PUBLIC_GTM_ID`)
- Meta Pixel ID: `25640573636` (configured inside GTM dashboard — no code change needed)
- No GA4 integration
- Do not modify any other component beyond the four files listed below
- Follow existing `"use client"` / Server Component split — do not convert server components to client components

---

### Task 1: Install package, add env var, extend types

**Files:**
- Modify: `package.json` (via npm install)
- Create/modify: `.env.local`
- Modify: `typings.d.ts`

**Interfaces:**
- Produces: `NEXT_PUBLIC_GTM_ID` env var available at build time; `window.dataLayer` typed globally

- [ ] **Step 1: Install `@next/third-parties`**

```bash
npm install @next/third-parties
```

Expected output: package added to `node_modules`, `package-lock.json` updated.

- [ ] **Step 2: Add GTM ID to `.env.local`**

If `.env.local` does not exist, create it. Add this line:

```
NEXT_PUBLIC_GTM_ID=GTM-637363636
```

- [ ] **Step 3: Add `window.dataLayer` type declaration**

Open `typings.d.ts` (currently contains only `declare module '*.css'`). Add the dataLayer declaration:

```ts
declare module '*.css'

interface Window {
  dataLayer: Record<string, unknown>[]
}
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json typings.d.ts .env.local
git commit -m "chore: install @next/third-parties and add GTM env var"
```

---

### Task 2: Create `GtmPageview` client component

**Files:**
- Create: `components/gtm-pageview.tsx`

**Interfaces:**
- Consumes: `window.dataLayer` (typed in Task 1), `usePathname` from `next/navigation`
- Produces: `<GtmPageview />` — a renderless client component; imported by Task 3

- [ ] **Step 1: Create the component**

Create `components/gtm-pageview.tsx` with this exact content:

```tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function GtmPageview() {
  const pathname = usePathname()

  useEffect(() => {
    window.dataLayer?.push({ event: 'pageview', page: pathname })
  }, [pathname])

  return null
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/gtm-pageview.tsx
git commit -m "feat: add GtmPageview client component for SPA route tracking"
```

---

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

### Task 4: Push `form_submit` event on lead form success

**Files:**
- Modify: `components/sections/LeadForm.tsx:65-78`

**Interfaces:**
- Consumes: `window.dataLayer` (typed in Task 1)
- Produces: `{ event: 'form_submit', form_name: 'contact' }` pushed to dataLayer on successful API response

- [ ] **Step 1: Add dataLayer push inside `onSubmit`**

Find the `onSubmit` function in `components/sections/LeadForm.tsx` (lines 65–78). The current `try` block is:

```ts
const res = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...values, website_confirm: honeypot, ...attribution }),
})
if (!res.ok) throw new Error()
setStatus('success')
```

Add the dataLayer push immediately after `setStatus('success')`:

```ts
const res = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...values, website_confirm: honeypot, ...attribution }),
})
if (!res.ok) throw new Error()
setStatus('success')
window.dataLayer?.push({ event: 'form_submit', form_name: 'contact' })
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify the event fires manually**

With the dev server running (`npm run dev`), open the lead form at `http://localhost:3000`. Open DevTools → Console. Submit the form with valid data. Then run:

```js
window.dataLayer
```

Expected: array contains an entry `{ event: 'form_submit', form_name: 'contact' }`.

- [ ] **Step 4: Commit**

```bash
git add components/sections/LeadForm.tsx
git commit -m "feat: push form_submit event to dataLayer on lead form success"
```

---

## GTM Dashboard Steps (post-deploy — no code changes)

After deploying, configure the following inside GTM (`tagmanager.google.com`):

### Triggers

| Name | Type | Settings |
|---|---|---|
| All Pages — Load | Page View — Window Loaded | fires on all pages |
| Route Change — Pageview | Custom Event | Event name: `pageview` |
| Lead Form Submit | Custom Event | Event name: `form_submit` |
| All Element Clicks | Click — All Elements | fires on all pages |
| Scroll Depth | Scroll Depth | Percentages: 25, 50, 75, 90 |

### Tags

**Meta Pixel — Base Code** (Custom HTML, trigger: All Pages — Load)

```html
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '25640573636');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=25640573636&ev=PageView&noscript=1"/>
</noscript>
```

**Meta Pixel — Route PageView** (Custom HTML, trigger: Route Change — Pageview)

```html
<script>
  if (typeof fbq !== 'undefined') { fbq('track', 'PageView'); }
</script>
```

**Meta Pixel — Lead** (Custom HTML, trigger: Lead Form Submit)

```html
<script>
  if (typeof fbq !== 'undefined') { fbq('track', 'Lead'); }
</script>
```

After creating all tags and triggers, click **Submit** in GTM to publish the container.
