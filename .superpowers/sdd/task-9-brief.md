### Task 9: Clients + Partners Sections

**Files:**
- Create: `components/sections/Clients.tsx`
- Create: `components/sections/Partners.tsx`

**Interfaces:**
- Consumes: `clients` from `@/data/clients`; `partners` from `@/data/partners`; `useTranslations`
- Produces: `<ClientsSection />`, `<PartnersSection />`

- [ ] **Step 1: Create Clients section**

Create `components/sections/Clients.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { clients } from '@/data/clients'

export function ClientsSection() {
  const t = useTranslations('clients')

  return (
    <section id="clients" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl font-black text-panther-black tracking-tight mb-3">{t('title')}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {clients.map((client) => (
            <div key={client.id}
              className="border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center hover:border-panther-red/20 hover:shadow-sm transition-all group">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-panther-red/8 transition-colors">
                <span className="text-2xl font-black text-gray-300 group-hover:text-panther-red/40 transition-colors">
                  {client.name.charAt(0)}
                </span>
              </div>
              <p className="font-semibold text-panther-black text-sm">{client.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{client.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Partners section**

Create `components/sections/Partners.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { partners } from '@/data/partners'

const badgeStyle: Record<string, string> = {
  operational: 'bg-blue-50 text-blue-600 border-blue-100',
  strategic:   'bg-violet-50 text-violet-600 border-violet-100',
  technology:  'bg-emerald-50 text-emerald-600 border-emerald-100',
}

export function PartnersSection() {
  const t = useTranslations('partners')

  return (
    <section id="partners" className="bg-gray-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl font-black text-panther-black tracking-tight mb-3">{t('title')}</h2>
          <p className="text-gray-500 max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <div key={partner.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-panther-red/20 hover:shadow-sm transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl font-black text-gray-300">{partner.name.charAt(0)}</span>
              </div>
              <p className="font-semibold text-panther-black mb-2">{partner.name}</p>
              <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${badgeStyle[partner.type]}`}>
                {partner.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit Clients + Partners**

```bash
git add -A
git commit -m "feat: add Clients and Partners sections"
```

---

