### Task 8: About + Services Sections

**Files:**
- Create: `components/sections/About.tsx`
- Create: `components/sections/Services.tsx`

**Interfaces:**
- Consumes: `useTranslations('about')`, `useTranslations('services')`, `services` from `@/data/services`
- Produces: `<AboutSection />`, `<ServicesSection />`

- [ ] **Step 1: Create About section**

Create `components/sections/About.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { Truck, Eye, TrendingUp, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: LucideIcon[] = [Truck, Eye, TrendingUp, Heart]

export function AboutSection() {
  const t = useTranslations('about')

  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-panther-black leading-tight tracking-tight mb-5">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('description')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {([1, 2, 3, 4] as const).map((n) => {
              const Icon = icons[n - 1]
              return (
                <div key={n}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-panther-red/25 hover:bg-panther-red/[0.02] transition-all group">
                  <div className="w-10 h-10 bg-panther-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-panther-red/20 transition-colors">
                    <Icon size={20} className="text-panther-red" />
                  </div>
                  <h3 className="font-bold text-panther-black mb-2 text-sm">{t(`feature${n}Title`)}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{t(`feature${n}Desc`)}</p>
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

- [ ] **Step 2: Create Services section**

Create `components/sections/Services.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { Package, Upload, MapPin, Users, Printer, DollarSign, Globe, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: LucideIcon[] = [Package, Upload, MapPin, Users, Printer, DollarSign, Globe, BarChart2]
const itemKeys = ['0','1','2','3','4','5','6','7'] as const

export function ServicesSection() {
  const t = useTranslations('services')

  return (
    <section id="services" className="bg-panther-dark py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">{t('title')}</h2>
          <p className="text-lg text-white/45 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {itemKeys.map((i) => {
            const Icon = icons[Number(i)]
            return (
              <div key={i}
                className="bg-panther-surface border border-white/8 rounded-2xl p-6 hover:border-panther-red/35 hover:bg-panther-red/[0.04] transition-all group cursor-default">
                <div className="w-11 h-11 bg-panther-red/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-panther-red/20 transition-colors">
                  <Icon size={22} className="text-panther-red" />
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{t(`item${i}Title`)}</h3>
                <p className="text-xs text-white/45 leading-relaxed">{t(`item${i}Desc`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit About + Services**

```bash
git add -A
git commit -m "feat: add About and Services sections"
```

---

