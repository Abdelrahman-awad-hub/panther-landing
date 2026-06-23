### Task 3: Data Config Files + Environment Setup

**Files:**
- Create: `data/services.ts`
- Create: `data/clients.ts`
- Create: `data/partners.ts`
- Create: `data/branches.ts`
- Create: `.env.example`
- Create: `lib/env.ts`

**Interfaces:**
- Produces: `services`, `clients`, `partners`, `branches` typed arrays; `env` object with typed config

- [ ] **Step 1: Create services data**

Create `data/services.ts`:

```typescript
export interface Service {
  id: string
  iconName: string
  titleKey: string
  descKey: string
}

export const services: Service[] = [
  { id: 'shipment-creation', iconName: 'Package',    titleKey: 'item0Title', descKey: 'item0Desc' },
  { id: 'bulk-upload',       iconName: 'Upload',     titleKey: 'item1Title', descKey: 'item1Desc' },
  { id: 'tracking',          iconName: 'MapPin',     titleKey: 'item2Title', descKey: 'item2Desc' },
  { id: 'saved-customers',   iconName: 'Users',      titleKey: 'item3Title', descKey: 'item3Desc' },
  { id: 'label-printing',    iconName: 'Printer',    titleKey: 'item4Title', descKey: 'item4Desc' },
  { id: 'pricing',           iconName: 'DollarSign', titleKey: 'item5Title', descKey: 'item5Desc' },
  { id: 'coverage',          iconName: 'Globe',      titleKey: 'item6Title', descKey: 'item6Desc' },
  { id: 'cod-performance',   iconName: 'BarChart2',  titleKey: 'item7Title', descKey: 'item7Desc' },
]
```

- [ ] **Step 2: Create clients data**

Create `data/clients.ts`:

```typescript
export interface Client {
  id: string
  name: string
  category: string
}

export const clients: Client[] = [
  { id: 'brand-1', name: 'Cairo Closet',  category: 'Fashion' },
  { id: 'brand-2', name: 'Delta Stores',  category: 'Electronics' },
  { id: 'brand-3', name: 'Nile Naturals', category: 'Beauty' },
  { id: 'brand-4', name: 'Memphis Gear',  category: 'Sports' },
  { id: 'brand-5', name: 'Sphinx Home',   category: 'Home & Living' },
  { id: 'brand-6', name: 'Luxor Kids',    category: 'Kids' },
  { id: 'brand-7', name: 'Sahara Supply', category: 'B2B' },
  { id: 'brand-8', name: 'Alex Apparel',  category: 'Fashion' },
]
```

- [ ] **Step 3: Create partners data**

Create `data/partners.ts`:

```typescript
export interface Partner {
  id: string
  name: string
  type: 'operational' | 'strategic' | 'technology'
}

export const partners: Partner[] = [
  { id: 'p1', name: 'EgyptPost',           type: 'operational' },
  { id: 'p2', name: 'Cairo Logistics Hub', type: 'operational' },
  { id: 'p3', name: 'Delta Warehousing',   type: 'strategic' },
  { id: 'p4', name: 'PayTech Egypt',       type: 'technology' },
  { id: 'p5', name: 'Gulf Express',        type: 'strategic' },
  { id: 'p6', name: 'AlexPort Services',   type: 'operational' },
]
```

- [ ] **Step 4: Create branches data**

Create `data/branches.ts`:

```typescript
export interface Branch {
  id: string
  city: string
  cityAr: string
  address: string
  addressAr: string
  phone: string
  areas: string[]
  areasAr: string[]
  isHQ?: boolean
}

export const branches: Branch[] = [
  {
    id: 'cairo',
    city: 'Cairo', cityAr: 'القاهرة',
    address: 'Nasr City, Cairo', addressAr: 'مدينة نصر، القاهرة',
    phone: '+20 2 XXXX XXXX',
    areas:   ['Nasr City','Heliopolis','New Cairo','Maadi','Zamalek','Downtown','Shubra','El Obour'],
    areasAr: ['مدينة نصر','مصر الجديدة','القاهرة الجديدة','المعادي','الزمالك','وسط البلد','شبرا','العبور'],
    isHQ: true,
  },
  {
    id: 'giza',
    city: 'Giza', cityAr: 'الجيزة',
    address: 'Dokki, Giza', addressAr: 'الدقي، الجيزة',
    phone: '+20 2 XXXX XXXX',
    areas:   ['Dokki','6th of October','Sheikh Zayed','Haram','Faisal','Imbaba'],
    areasAr: ['الدقي','السادس من أكتوبر','الشيخ زايد','الهرم','فيصل','إمبابة'],
  },
  {
    id: 'alexandria',
    city: 'Alexandria', cityAr: 'الإسكندرية',
    address: 'Smouha, Alexandria', addressAr: 'سموحة، الإسكندرية',
    phone: '+20 3 XXXX XXXX',
    areas:   ['Smouha','Roushdi','Agami','Borg El Arab','Miami','Sidi Bishr'],
    areasAr: ['سموحة','رشدي','العجمي','برج العرب','ميامي','سيدي بشر'],
  },
  {
    id: 'mansoura',
    city: 'Mansoura', cityAr: 'المنصورة',
    address: 'City Center, Mansoura', addressAr: 'وسط المدينة، المنصورة',
    phone: '+20 50 XXXX XXXX',
    areas:   ['Mansoura','Talkha','Sherbin','Mit Ghamr'],
    areasAr: ['المنصورة','طلخا','شربين','ميت غمر'],
  },
  {
    id: 'tanta',
    city: 'Tanta', cityAr: 'طنطا',
    address: 'El Geish Street, Tanta', addressAr: 'شارع الجيش، طنطا',
    phone: '+20 40 XXXX XXXX',
    areas:   ['Tanta','Kafr El Zayat','Samannoud','Basyoun'],
    areasAr: ['طنطا','كفر الزيات','سمنود','بسيون'],
  },
  {
    id: 'assiut',
    city: 'Assiut', cityAr: 'أسيوط',
    address: 'New Assiut, Assiut', addressAr: 'أسيوط الجديدة، أسيوط',
    phone: '+20 88 XXXX XXXX',
    areas:   ['Assiut','Abnub','El Qusiya','Sohag'],
    areasAr: ['أسيوط','أبنوب','القوصية','سوهاج'],
  },
]
```

- [ ] **Step 5: Create .env.example**

Create `.env.example`:

```bash
# Seller Portal URL
NEXT_PUBLIC_SELLER_PORTAL_URL=https://portal.pantherexpress.com

# Google Sheets — Lead Form Storage
# 1. Create a Google Cloud project and enable the Sheets API
# 2. Create a Service Account and download the JSON key
# 3. Share your Google Sheet with the service account email
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
```

- [ ] **Step 6: Create typed env module**

Create `lib/env.ts`:

```typescript
export const env = {
  sellerPortalUrl: process.env.NEXT_PUBLIC_SELLER_PORTAL_URL ?? '#',
  google: {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    sheetId: process.env.GOOGLE_SHEET_ID ?? '',
  },
} as const
```

- [ ] **Step 7: Commit data config**

```bash
git add -A
git commit -m "feat: add mock data configs for services, clients, partners, branches, and env setup"
```

---

