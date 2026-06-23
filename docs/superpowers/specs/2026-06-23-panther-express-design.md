# Panther Express Marketing Website — Design Spec

## Overview
Temporary branded marketing/seller-acquisition website for Panther Express.
Acts as the front door for the Seller Portal product until the full website is ready.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- next-intl for bilingual (English + Arabic / RTL) support
- Google Sheets API for lead capture storage

## Brand
- Primary: bold red `#E5001A`
- Base: near-black `#0A0A0A`, dark surface `#111111`
- Neutral: white `#FFFFFF`, light gray `#F5F5F5`, muted `#6B7280`
- Typography: Inter (Latin), Cairo (Arabic)
- Feel: speed, precision, sharp edges, motion accents, high contrast

## i18n
- next-intl with `[locale]` route segment: `/en/...` and `/ar/...`
- RTL via `<html dir>` + Tailwind `rtl:` variants
- Locale JSON files in `/messages/en.json` and `/messages/ar.json`
- Language toggle in header

## Page Sections (single-page home)
1. **Header/Nav** — logo (placeholder SVG), nav anchors, "Become a Seller" (red CTA), "Seller Login" (outline), language toggle
2. **Hero** — dark bg, bold headline, sub-headline, dual CTAs (lead form / seller login), speed-line / motion background accent
3. **About** — Panther Express mission: reliable delivery, merchant enablement, visibility, scale
4. **Services** — grid cards: shipment creation, bulk Excel upload, order tracking, saved customers, label printing, pricing visibility, coverage, COD/performance
5. **Clients** — logo grid with placeholder brand cards, easy to replace
6. **Partners** — strategic/operational partners placeholder grid
7. **Branches & Coverage** — data-driven from `/data/branches.ts`, cards by city/region
8. **Seller Portal Highlights** — feature showcase: what sellers can do after joining
9. **Lead Capture Form** — brand name, phone, monthly volume (dropdown), social link, website URL; full UTM + referrer attribution

## Lead Form
- Required: brand name, phone, volume category
- Optional+validated: social link, website URL
- Collects: UTM params, referrer, landing URL, user agent, timestamp
- Backend: Next.js Server Action → Google Sheets API
- States: idle, loading, success, error
- Spam: honeypot field + rate-limit header check

## Backend
- `/app/api/leads/route.ts` — POST endpoint
- `/lib/google-sheets.ts` — Google Sheets API client utility
- Config via env: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`
- `NEXT_PUBLIC_SELLER_PORTAL_URL` — seller portal login URL
- Other env vars in `.env.example`

## Data Files (mock content, easy to edit)
- `/data/services.ts`
- `/data/clients.ts`
- `/data/partners.ts`
- `/data/branches.ts`

## Project Structure
```
/app
  /[locale]
    layout.tsx
    page.tsx
  /api/leads/route.ts
/components
  /layout       — Header, Footer
  /sections     — Hero, About, Services, Clients, Partners, Branches, SellerHighlights, LeadForm
  /ui           — shadcn components + custom atoms
/data           — mock content configs
/lib            — google-sheets.ts, utils.ts
/messages       — en.json, ar.json
/public         — logo SVG, assets
```

## Out of Scope (this phase)
- Shipment tracking entry
- CMS / admin panel
- Authentication
- Analytics integration
