# GTM Integration Design

**Date:** 2026-06-27  
**Project:** Panther Express Landing Page  
**Status:** Approved

## Overview

Integrate Google Tag Manager into the Next.js 14 App Router landing page using `@next/third-parties`. GTM will serve as the container for all tracking tags including Meta Pixel.

## IDs

| Service | ID |
|---|---|
| GTM Container | `GTM-637363636` |
| Meta Pixel | `25640573636` |
| GA4 | Not used |

## Architecture

### 1. Package

Install `@next/third-parties` — Next.js's official third-party integration library.

### 2. `app/[locale]/layout.tsx`

- Import `GoogleTagManager` from `@next/third-parties/google`
- Add `<GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />` inside the layout — before `<html>` (it renders both the `<head>` script and `<noscript>` body fallback internally)
- Mount `<GtmPageview />` inside `<body>` so route changes are tracked

### 3. `components/gtm-pageview.tsx`

A `"use client"` component that:
- Reads `usePathname()` from `next/navigation`
- On every pathname change, pushes `{ event: 'pageview', page: pathname }` to `window.dataLayer`
- Renders nothing (`null`)

### 4. Environment

`.env.local`:
```
NEXT_PUBLIC_GTM_ID=GTM-637363636
```

`.env.local` is git-ignored by default in Next.js — the ID is not secret but keeping it in env makes it swappable per environment.

## GTM Dashboard Configuration (post-deploy)

No further code changes needed after implementation. All additional tracking is configured inside GTM:

### Tags to create in GTM

| Tag | Type | Trigger |
|---|---|---|
| Meta Pixel — Base Code | Custom HTML | All Pages |
| Meta Pixel — PageView | Custom HTML | All Pages |

### Triggers to create in GTM

| Trigger | Type | Notes |
|---|---|---|
| All Pages | Page View — Window Loaded | Fires on initial load |
| Route Change | Custom Event — `pageview` | Fired by `gtm-pageview.tsx` on SPA navigation |
| Form Submit | Custom Event — `form_submit` | App must push this event to dataLayer on form success |
| All Clicks | Click — All Elements | For button click tracking |
| Scroll Depth | Scroll Depth | 25%, 50%, 75%, 90% thresholds |

### Meta Pixel Tag (Custom HTML)

```html
<script>
!function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '25640573636');
fbq('track', 'PageView');
</script>
```

## Form Submission Tracking

The existing form in the app needs one addition: push a `form_submit` event to `window.dataLayer` on successful submission:

```ts
window.dataLayer?.push({ event: 'form_submit', form_name: 'contact' })
```

This is handled in the GTM trigger — no new tags needed.

## Files Changed

| File | Change |
|---|---|
| `package.json` | Add `@next/third-parties` |
| `.env.local` | Add `NEXT_PUBLIC_GTM_ID` |
| `app/[locale]/layout.tsx` | Add `GoogleTagManager` + `GtmPageview` |
| `components/gtm-pageview.tsx` | New — route change pageview pusher |
| Form component | Add `dataLayer.push` on submit success |
