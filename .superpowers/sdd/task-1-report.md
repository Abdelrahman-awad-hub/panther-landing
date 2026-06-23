## Task 1 Report: Project Scaffold + Tailwind Brand Config

**Status:** DONE_WITH_CONCERNS

---

### Files Created / Modified

**Created:**
- `tailwind.config.ts` — brand colors, fonts, animations (exact from brief)
- `next.config.js` — placeholder Next.js config (JS, not TS — see concern #1)
- `components.json` — shadcn/ui config
- `components/ui/button.tsx` — shadcn button
- `components/ui/input.tsx` — shadcn input
- `components/ui/label.tsx` — shadcn label
- `components/ui/select.tsx` — shadcn select
- `components/ui/form.tsx` — shadcn form (manually created — see concern #2)
- `components/ui/badge.tsx` — shadcn badge
- `components/ui/card.tsx` — shadcn card
- `lib/utils.ts` — cn() utility

**Modified:**
- `app/globals.css` — replaced with brand CSS variables from brief (exact)
- `app/layout.tsx` — removed Geist font, simplified to plain layout
- `package.json` — pinned to Next.js 14.2.35, React 18, Tailwind v3, added all deps
- `postcss.config.mjs` — updated from Tailwind v4 to v3 syntax
- `tsconfig.json` — updated by Next.js dev server (jsx: preserve)

**Deleted:**
- `next.config.ts` — replaced with `next.config.js` (see concern #1)

---

### Commits

| Hash | Message |
|------|---------|
| `c9705fd` | feat: initialize Next.js 14 with Tailwind brand theme and shadcn/ui |

---

### Concerns / Deviations

1. **`next.config.ts` → `next.config.js`**: Next.js 14 does not support TypeScript config files (`next.config.ts`). This was added in Next.js 15. The brief says to create `next.config.ts` as a placeholder, but doing so breaks the dev server with Next.js 14. Created `next.config.js` instead (equivalent content, same placeholder).

2. **`npx shadcn@latest form` did not create a file**: The `shadcn@4.11.0` CLI's `form` component silently exited without creating a file (no error, no output). The `form.tsx` component was manually created using the standard shadcn/ui form component pattern with `react-hook-form` Controller/Provider bindings. Radix UI `@radix-ui/react-slot` was installed to support it. The component is functionally equivalent to the expected shadcn form component.

3. **`create-next-app` installed Next.js 16.2.9 + Tailwind v4** instead of Next.js 14 + Tailwind v3 (as specified in the brief). The project was manually downgraded: `next@14.2.35`, `react@18`, `tailwindcss@3`, `eslint@8`, `eslint-config-next@14.2.35`. All brief-specified behavior (tailwind.config.ts with plugins, @tailwind directives in globals.css) is intact.

4. **Geist font removed**: shadcn's `--defaults` init added Geist font back to `layout.tsx`. This was reverted — layout.tsx uses no Google Fonts now (fonts will be added in a later task for Inter + Cairo).

---

### Verification

- Dev server starts: ✓ (`next dev` → Next.js 14.2.35 ready in ~3s)
- HTTP 200: ✓ (confirmed with curl on running dev server)
- `tailwindcss-animate` installed: ✓
- All 7 shadcn components present in `components/ui/`: ✓
