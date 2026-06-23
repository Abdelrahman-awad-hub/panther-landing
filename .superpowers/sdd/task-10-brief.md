### Task 10: Branches + Seller Portal Highlights Sections

**Files:**
- Create: `components/sections/Branches.tsx`
- Create: `components/sections/SellerHighlights.tsx`

**Interfaces:**
- Consumes: `branches` from `@/data/branches`; `useTranslations('branches')`, `useTranslations('sellerHighlights')`, `useLocale()`
- Produces: `<BranchesSection />`, `<SellerHighlightsSection sellerPortalUrl />`

- [ ] **Step 1: Create Branches section**

Create `components/sections/Branches.tsx`:

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone } from 'lucide-react'
import { branches } from '@/data/branches'

export function BranchesSection() {
  const t = useTranslations('branches')
  const locale = useLocale()
  const isAr = locale === 'ar'

  return (
    <section id="branches" className="bg-panther-black py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-3">{t('title')}</h2>
          <p className="text-white/45 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div key={branch.id}
              className={`bg-panther-surface border rounded-2xl p-6 hover:border-panther-red/35 transition-all ${
                branch.isHQ ? 'border-panther-red/25' : 'border-white/8'
              }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{isAr ? branch.cityAr : branch.city}</h3>
                  {branch.isHQ && (
                    <span className="inline-block mt-1 text-xs font-bold text-panther-red bg-panther-red/10 border border-panther-red/20 px-2 py-0.5 rounded-full">
                      {t('hqLabel')}
                    </span>
                  )}
                </div>
                <div className="w-9 h-9 bg-panther-red/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={17} className="text-panther-red" />
                </div>
              </div>

              <p className="text-white/45 text-sm mb-3 flex items-start gap-1.5">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                {isAr ? branch.addressAr : branch.address}
              </p>

              <p className="text-white/25 text-xs mb-4 flex items-center gap-1.5">
                <Phone size={12} className="shrink-0" />
                <span dir="ltr">{branch.phone}</span>
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(isAr ? branch.areasAr : branch.areas).slice(0, 4).map((area) => (
                  <span key={area}
                    className="text-xs bg-white/5 text-white/35 border border-white/8 px-2 py-0.5 rounded-full">
                    {area}
                  </span>
                ))}
                {branch.areas.length > 4 && (
                  <span className="text-xs text-white/25 py-0.5">+{branch.areas.length - 4}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Seller Highlights section**

Create `components/sections/SellerHighlights.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package, Upload, MapPin, Printer, Users, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const featureIcons: LucideIcon[] = [Package, Upload, MapPin, Printer, Users, BarChart2]
const featureKeys = ['0','1','2','3','4','5'] as const

interface SellerHighlightsProps {
  sellerPortalUrl: string
}

export function SellerHighlightsSection({ sellerPortalUrl }: SellerHighlightsProps) {
  const t = useTranslations('sellerHighlights')

  return (
    <section id="portal" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Sticky text */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-panther-black leading-tight tracking-tight mb-5">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">{t('subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#join">
                <Button className="bg-panther-red hover:bg-panther-red-dark text-white font-semibold px-6 group">
                  {t('ctaJoin')}
                  <ArrowRight size={16} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                </Button>
              </a>
              <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-gray-200 text-panther-black hover:bg-gray-50">
                  {t('ctaLogin')}
                </Button>
              </a>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureKeys.map((i) => {
              const Icon = featureIcons[Number(i)]
              return (
                <div key={i}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-panther-red/20 hover:bg-panther-red/[0.02] transition-all group">
                  <div className="w-10 h-10 bg-panther-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-panther-red/20 transition-colors">
                    <Icon size={20} className="text-panther-red" />
                  </div>
                  <h3 className="font-bold text-panther-black mb-1.5 text-sm">{t(`feature${i}Title`)}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t(`feature${i}Desc`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit Branches + SellerHighlights**

```bash
git add -A
git commit -m "feat: add Branches (locale-aware) and SellerHighlights sections"
```

---

