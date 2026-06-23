### Task 12: Home Page Assembly + Final Verification

**Files:**
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: all section + layout components, `env`
- Produces: complete rendered bilingual home page at `/en` and `/ar`

- [ ] **Step 1: Replace placeholder home page with full assembly**

Replace `app/[locale]/page.tsx`:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/Hero'
import { AboutSection } from '@/components/sections/About'
import { ServicesSection } from '@/components/sections/Services'
import { ClientsSection } from '@/components/sections/Clients'
import { PartnersSection } from '@/components/sections/Partners'
import { BranchesSection } from '@/components/sections/Branches'
import { SellerHighlightsSection } from '@/components/sections/SellerHighlights'
import { LeadFormSection } from '@/components/sections/LeadForm'
import { env } from '@/lib/env'

export default function HomePage() {
  const sellerPortalUrl = env.sellerPortalUrl

  return (
    <>
      <Header sellerPortalUrl={sellerPortalUrl} />
      <main>
        <HeroSection sellerPortalUrl={sellerPortalUrl} />
        <AboutSection />
        <ServicesSection />
        <ClientsSection />
        <PartnersSection />
        <BranchesSection />
        <SellerHighlightsSection sellerPortalUrl={sellerPortalUrl} />
        <LeadFormSection />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Production build check**

```bash
npm run build 2>&1 | tail -30
```
Expected: Compiled successfully. No TypeScript errors. Routes for `/en` and `/ar` listed.

- [ ] **Step 3: Smoke test both locales**

```bash
npm run dev &
sleep 6
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ar
kill %1
```
Expected: both return `200`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: assemble full Panther Express home page — bilingual EN/AR with all sections"
```

---

## Self-Review

**Spec coverage:**
- Header / Nav ✅ Task 6
- Hero ✅ Task 7
- About ✅ Task 8
- Services ✅ Task 8
- Clients ✅ Task 9
- Partners ✅ Task 9
- Branches & Coverage ✅ Task 10
- Seller Portal Highlights ✅ Task 10
- Lead Capture Form (all fields, UTM, honeypot) ✅ Task 11
- Bilingual EN/AR + RTL ✅ Tasks 2, 6–11
- Google Sheets backend ✅ Task 4
- Env-based config ✅ Task 3
- Placeholder SVG logo ✅ Task 5
- Mock data configs ✅ Task 3
- `.env.example` ✅ Task 3
- Root locale redirect ✅ Task 2

**Placeholder scan:** No TBDs or TODOs. All code blocks are complete and compilable.

**Type consistency:** `LeadSubmission` defined once in `lib/lead-schema.ts`, imported into `app/api/leads/route.ts` and `LeadForm.tsx`. `Branch.areas` / `Branch.areasAr` used consistently (not `coverageAreas`). All `featureKeys`, `itemKeys`, `featureIcons` arrays are aligned by index.

**No silent caps:** All 8 clients, 6 partners, 6 branches rendered; coverage areas show max 4 + overflow count.
