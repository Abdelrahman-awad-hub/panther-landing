# Panther Express Marketing Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality bilingual (EN/AR, RTL) marketing/seller-acquisition website for Panther Express — header, 8 page sections, lead capture form, Google Sheets backend.

**Architecture:** Next.js 14 App Router with `app/[locale]/` dynamic segment for i18n via next-intl. All sections are Server Components except `LeadForm` (Client Component with react-hook-form + Zod). Lead submissions POST to `/api/leads` which appends a row to Google Sheets via the googleapis SDK.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, next-intl, react-hook-form, @hookform/resolvers, zod, googleapis

## Global Constraints

- Node 18+ required
- Next.js 14 App Router only — no Pages Router patterns
- All env secrets via `process.env` — never hardcoded
- All UI strings via next-intl — no hardcoded text in components
- RTL layout for `ar` locale via `dir="rtl"` on `<html>` + Tailwind `rtl:` variants
- Brand colors: red `#E5001A`, near-black `#0A0A0A`, dark surface `#111111`, surface `#1A1A1A`
- Fonts: Inter (Latin/en), Cairo (Arabic/ar) — loaded via `next/font/google`
- Working directory: `/Users/abdelrahmanawad/LandingPage` (currently empty)

---

### Task 1: Project Scaffold + Tailwind Brand Config

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `next.config.ts` (placeholder, replaced in Task 2)

**Interfaces:**
- Produces: working Next.js dev server, Tailwind with panther brand colors, all deps installed, shadcn/ui initialized

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/abdelrahmanawad/LandingPage
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --yes
```
Expected output: "Success! Created..." with no errors.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install next-intl googleapis react-hook-form @hookform/resolvers zod
```

- [ ] **Step 3: Install and initialize shadcn/ui**

```bash
npx shadcn@latest init --yes --defaults
```

- [ ] **Step 4: Add required shadcn components**

```bash
npx shadcn@latest add button input label select form badge card
```

- [ ] **Step 5: Replace tailwind.config.ts with brand theme**

Replace the full contents of `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        panther: {
          red: '#E5001A',
          'red-dark': '#B8001A',
          'red-light': '#FF1A33',
          black: '#0A0A0A',
          dark: '#111111',
          surface: '#1A1A1A',
          gray: '#2A2A2A',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

- [ ] **Step 6: Replace app/globals.css with brand CSS variables**

Replace the full contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 4%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 4%;
    --primary: 352 100% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 10%;
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 352 100% 45%;
    --radius: 0.5rem;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}

[dir="rtl"] body {
  font-family: var(--font-cairo), system-ui, sans-serif;
}

[dir="ltr"] body {
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev &
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```
Expected: `200`

```bash
kill %1
```

- [ ] **Step 8: Commit scaffold**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 with Tailwind brand theme and shadcn/ui"
```

---

### Task 2: i18n Setup (next-intl + locale routing)

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Modify: `next.config.ts`
- Create: `messages/en.json`
- Create: `messages/ar.json`

**Interfaces:**
- Produces: `useTranslations('namespace')` available in all components; `/en` and `/ar` routes working; `dir="rtl"` set on `<html>` for Arabic

- [ ] **Step 1: Create i18n routing config**

Create `i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
})
```

- [ ] **Step 2: Create i18n request config**

Create `i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Create Next.js middleware**

Create `middleware.ts` at project root:

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 4: Update next.config.ts**

Replace full contents of `next.config.ts`:

```typescript
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 5: Restructure app directory for [locale] routing**

```bash
# Remove auto-generated app contents (keep globals.css)
mkdir -p /Users/abdelrahmanawad/LandingPage/app/\[locale\]
# Move globals.css stays at app/globals.css — import it from locale layout
```

Create `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Cairo } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' })

export const metadata: Metadata = {
  title: 'Panther Express — Ship Faster, Grow Bigger',
  description: "Egypt's trusted logistics partner for e-commerce brands and growing merchants.",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound()
  }
  const messages = await getMessages()
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${inter.variable} ${cairo.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

Create placeholder `app/[locale]/page.tsx`:

```tsx
export default function HomePage() {
  return <main className="min-h-screen bg-panther-black text-white flex items-center justify-center">Panther Express</main>
}
```

Create root redirect `app/page.tsx`:

```tsx
import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
```

Delete the auto-generated `app/layout.tsx` if it exists (the locale layout replaces it):

```bash
rm -f /Users/abdelrahmanawad/LandingPage/app/layout.tsx
```

- [ ] **Step 6: Create English messages file**

Create `messages/en.json`:

```json
{
  "nav": {
    "services": "Services",
    "about": "About Us",
    "clients": "Our Clients",
    "branches": "Coverage",
    "partners": "Partners",
    "portal": "Seller Portal",
    "becomeASeller": "Become a Seller",
    "sellerLogin": "Seller Login"
  },
  "hero": {
    "badge": "Egypt's Fastest Growing Logistics Platform",
    "headline": "Ship Faster.\nGrow Bigger.",
    "subheadline": "Panther Express gives growing brands the logistics infrastructure they need — fast, reliable delivery, full shipment visibility, and a seller portal built for serious operators.",
    "ctaPrimary": "Start Shipping Today",
    "ctaSecondary": "Seller Login",
    "stat1Value": "48h",
    "stat1Label": "Average Delivery",
    "stat2Value": "99%",
    "stat2Label": "Tracking Accuracy",
    "stat3Value": "500+",
    "stat3Label": "Active Sellers"
  },
  "about": {
    "badge": "Who We Are",
    "title": "Built for Sellers Who Ship at Scale",
    "description": "Panther Express is a logistics and fulfillment partner for Egyptian e-commerce brands and growing merchants. We obsess over reliable delivery, operational simplicity, and giving you the real-time visibility you need to run a tight operation.",
    "feature1Title": "Reliable Delivery",
    "feature1Desc": "Consistent, on-time delivery across Egypt — every shipment, every time.",
    "feature2Title": "Full Visibility",
    "feature2Desc": "Track every order in real time. No blind spots, no guessing.",
    "feature3Title": "Scale Ready",
    "feature3Desc": "From 10 shipments to 10,000 — our infrastructure grows with your business.",
    "feature4Title": "Seller First",
    "feature4Desc": "Every feature we build starts with what makes your operations easier."
  },
  "services": {
    "badge": "What We Offer",
    "title": "Everything You Need to Ship and Scale",
    "subtitle": "A complete logistics toolkit designed for merchants who take operations seriously.",
    "item0Title": "Shipment Creation",
    "item0Desc": "Create individual shipments in seconds with full address and product details.",
    "item1Title": "Bulk Order Upload",
    "item1Desc": "Upload hundreds of orders at once via Excel. Save hours of manual entry.",
    "item2Title": "Order Tracking",
    "item2Desc": "Public and private tracking for every waybill. Your customers always know where their order is.",
    "item3Title": "Saved Customers",
    "item3Desc": "Build a customer address book. Repeat orders in seconds.",
    "item4Title": "Label Printing",
    "item4Desc": "Print professional shipping labels as PDF. Ready for any printer.",
    "item5Title": "Pricing Visibility",
    "item5Desc": "See your exact shipping rates by zone. No surprises on your invoice.",
    "item6Title": "Branch Coverage",
    "item6Desc": "Wide delivery network across Egypt. Check if your customers' areas are covered.",
    "item7Title": "COD & Performance",
    "item7Desc": "Track your cash-on-delivery remittances, balances, and delivery performance in one place."
  },
  "clients": {
    "badge": "Our Sellers",
    "title": "Trusted by Growing Brands",
    "subtitle": "From fashion to electronics — Panther Express powers shipments for brands across all categories."
  },
  "partners": {
    "badge": "Our Partners",
    "title": "Built on Strong Partnerships",
    "subtitle": "We work with trusted operational and strategic partners to deliver a seamless logistics experience."
  },
  "branches": {
    "badge": "Coverage",
    "title": "We Deliver Across Egypt",
    "subtitle": "With branches in every major city and coverage in hundreds of areas, we make sure your customers can always receive their orders.",
    "hqLabel": "Headquarters"
  },
  "sellerHighlights": {
    "badge": "Seller Portal",
    "title": "Your Operations Hub",
    "subtitle": "The Panther Express Seller Portal gives you everything you need to manage shipments, customers, and performance — all in one place.",
    "ctaJoin": "Join as a Seller",
    "ctaLogin": "Access Your Portal",
    "feature0Title": "Create Shipments",
    "feature0Desc": "Submit new orders instantly from your dashboard.",
    "feature1Title": "Bulk Upload",
    "feature1Desc": "Upload 100s of orders from Excel in one click.",
    "feature2Title": "Track Everything",
    "feature2Desc": "Real-time status for every shipment in your account.",
    "feature3Title": "Print Labels",
    "feature3Desc": "Generate PDF labels for every order instantly.",
    "feature4Title": "Customer Management",
    "feature4Desc": "Save and reuse customer addresses. Ship repeat orders fast.",
    "feature5Title": "Financial Visibility",
    "feature5Desc": "View balances, COD remittances, and performance data anytime."
  },
  "leadForm": {
    "badge": "Get Started",
    "title": "Ready to Ship with Panther?",
    "subtitle": "Tell us about your brand and we'll get you set up on the Seller Portal — usually within 24 hours.",
    "brandName": "Brand Name",
    "brandNamePlaceholder": "e.g. Cairo Closet",
    "phone": "Phone Number",
    "phonePlaceholder": "+20 1XX XXX XXXX",
    "volume": "Monthly Shipment Volume",
    "volumePlaceholder": "Select your volume",
    "volume300": "Up to 300 shipments / month",
    "volume1000": "Up to 1,000 shipments / month",
    "volume5000": "Up to 5,000 shipments / month",
    "volume5000plus": "More than 5,000 shipments / month",
    "social": "Social Media Link",
    "socialPlaceholder": "https://instagram.com/yourbrand",
    "website": "Website URL",
    "websitePlaceholder": "https://yourbrand.com",
    "submit": "Submit Application",
    "submitting": "Submitting...",
    "successTitle": "Application Received!",
    "successMessage": "We'll review your details and reach out within 24 hours to get you set up.",
    "errorMessage": "Something went wrong. Please try again or contact us directly.",
    "brandNameRequired": "Brand name is required",
    "phoneRequired": "Phone number is required",
    "phoneInvalid": "Please enter a valid Egyptian phone number",
    "volumeRequired": "Please select your monthly shipment volume",
    "urlInvalid": "Please enter a valid URL (starting with https://)"
  },
  "footer": {
    "tagline": "Fast. Reliable. Built for Sellers.",
    "copyright": "© 2024 Panther Express. All rights reserved.",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "contact": "Contact Us"
  }
}
```

- [ ] **Step 7: Create Arabic messages file**

Create `messages/ar.json`:

```json
{
  "nav": {
    "services": "خدماتنا",
    "about": "من نحن",
    "clients": "عملاؤنا",
    "branches": "مناطق التغطية",
    "partners": "شركاؤنا",
    "portal": "بوابة البائعين",
    "becomeASeller": "انضم كبائع",
    "sellerLogin": "دخول البائعين"
  },
  "hero": {
    "badge": "منصة اللوجستيات الأسرع نموًا في مصر",
    "headline": "شحن أسرع.\nنمو أكبر.",
    "subheadline": "بانثر إكسبريس يمنح الماركات الناشئة البنية اللوجستية التي تحتاجها — توصيل سريع وموثوق، تتبع كامل للشحنات، وبوابة بائعين مصممة للمحترفين.",
    "ctaPrimary": "ابدأ الشحن اليوم",
    "ctaSecondary": "دخول البائعين",
    "stat1Value": "48 ساعة",
    "stat1Label": "متوسط التوصيل",
    "stat2Value": "99%",
    "stat2Label": "دقة التتبع",
    "stat3Value": "+500",
    "stat3Label": "بائع نشط"
  },
  "about": {
    "badge": "من نحن",
    "title": "مصممون للبائعين الجادين",
    "description": "بانثر إكسبريس شريكك اللوجستي لماركات التجارة الإلكترونية المصرية والتجار في طور النمو. نركز على التوصيل الموثوق، البساطة التشغيلية، والرؤية الفورية التي تحتاجها لإدارة عمليات محكمة.",
    "feature1Title": "توصيل موثوق",
    "feature1Desc": "توصيل منتظم وفي الوقت المحدد في جميع أنحاء مصر — لكل شحنة، في كل مرة.",
    "feature2Title": "رؤية كاملة",
    "feature2Desc": "تتبع كل طلب في الوقت الفعلي. بدون نقاط عمياء أو تخمين.",
    "feature3Title": "جاهز للتوسع",
    "feature3Desc": "من 10 شحنات إلى 10,000 — بنيتنا التحتية تنمو مع أعمالك.",
    "feature4Title": "البائع أولًا",
    "feature4Desc": "كل ميزة نبنيها تبدأ بما يجعل عملياتك أسهل."
  },
  "services": {
    "badge": "ما نقدمه",
    "title": "كل ما تحتاجه للشحن والنمو",
    "subtitle": "مجموعة أدوات لوجستية متكاملة مصممة للتجار الجادين في عملياتهم.",
    "item0Title": "إنشاء الشحنات",
    "item0Desc": "أنشئ شحنات فردية في ثوانٍ مع بيانات العنوان والمنتج الكاملة.",
    "item1Title": "رفع الطلبات بالجملة",
    "item1Desc": "ارفع مئات الطلبات دفعة واحدة عبر Excel. وفر ساعات من الإدخال اليدوي.",
    "item2Title": "تتبع الطلبات",
    "item2Desc": "تتبع عام وخاص لكل بوليصة شحن. عملاؤك يعرفون دائمًا أين طلبهم.",
    "item3Title": "العملاء المحفوظون",
    "item3Desc": "أنشئ دفتر عناوين للعملاء. أعد الطلبات في ثوانٍ.",
    "item4Title": "طباعة الملصقات",
    "item4Desc": "اطبع ملصقات شحن احترافية بصيغة PDF. مناسبة لأي طابعة.",
    "item5Title": "شفافية الأسعار",
    "item5Desc": "اطلع على أسعار الشحن الدقيقة حسب المنطقة. بدون مفاجآت في الفاتورة.",
    "item6Title": "تغطية الفروع",
    "item6Desc": "شبكة توصيل واسعة في جميع أنحاء مصر. تحقق من تغطية مناطق عملائك.",
    "item7Title": "الدفع عند الاستلام والأداء",
    "item7Desc": "تتبع مستحقات الدفع عند الاستلام وأرصدتك وأداء التوصيل في مكان واحد."
  },
  "clients": {
    "badge": "بائعونا",
    "title": "موثوق من الماركات الناشئة",
    "subtitle": "من الأزياء إلى الإلكترونيات — بانثر إكسبريس يدعم شحنات ماركات من جميع الفئات."
  },
  "partners": {
    "badge": "شركاؤنا",
    "title": "مبنيون على شراكات قوية",
    "subtitle": "نعمل مع شركاء تشغيليين واستراتيجيين موثوقين لتوفير تجربة لوجستية سلسة."
  },
  "branches": {
    "badge": "التغطية",
    "title": "نوصل في جميع أنحاء مصر",
    "subtitle": "بفروع في كل مدينة رئيسية وتغطية في مئات المناطق، نضمن أن عملاءك يستطيعون دائمًا استلام طلباتهم.",
    "hqLabel": "المقر الرئيسي"
  },
  "sellerHighlights": {
    "badge": "بوابة البائعين",
    "title": "مركز عملياتك",
    "subtitle": "تمنحك بوابة بائعين بانثر إكسبريس كل ما تحتاجه لإدارة الشحنات والعملاء والأداء — كل ذلك في مكان واحد.",
    "ctaJoin": "انضم كبائع",
    "ctaLogin": "الدخول إلى بوابتك",
    "feature0Title": "إنشاء الشحنات",
    "feature0Desc": "أرسل طلبات جديدة على الفور من لوحة التحكم.",
    "feature1Title": "الرفع بالجملة",
    "feature1Desc": "ارفع مئات الطلبات من Excel بنقرة واحدة.",
    "feature2Title": "تتبع كل شيء",
    "feature2Desc": "حالة فورية لكل شحنة في حسابك.",
    "feature3Title": "طباعة الملصقات",
    "feature3Desc": "أنشئ ملصقات PDF لكل طلب على الفور.",
    "feature4Title": "إدارة العملاء",
    "feature4Desc": "احفظ عناوين العملاء وأعد استخدامها. شحن الطلبات المتكررة بسرعة.",
    "feature5Title": "الشفافية المالية",
    "feature5Desc": "اطلع على الأرصدة ومستحقات الدفع عند الاستلام وبيانات الأداء في أي وقت."
  },
  "leadForm": {
    "badge": "ابدأ الآن",
    "title": "مستعد للشحن مع بانثر؟",
    "subtitle": "أخبرنا عن ماركتك وسنجهزك على بوابة البائعين — عادةً خلال 24 ساعة.",
    "brandName": "اسم الماركة",
    "brandNamePlaceholder": "مثال: كايرو كلوزيت",
    "phone": "رقم الهاتف",
    "phonePlaceholder": "+20 1XX XXX XXXX",
    "volume": "حجم الشحنات الشهري",
    "volumePlaceholder": "اختر حجمك",
    "volume300": "حتى 300 شحنة / شهر",
    "volume1000": "حتى 1,000 شحنة / شهر",
    "volume5000": "حتى 5,000 شحنة / شهر",
    "volume5000plus": "أكثر من 5,000 شحنة / شهر",
    "social": "رابط التواصل الاجتماعي",
    "socialPlaceholder": "https://instagram.com/yourband",
    "website": "عنوان الموقع",
    "websitePlaceholder": "https://yourband.com",
    "submit": "تقديم الطلب",
    "submitting": "جاري التقديم...",
    "successTitle": "تم استلام طلبك!",
    "successMessage": "سنراجع تفاصيلك ونتواصل معك خلال 24 ساعة لإعداد حسابك.",
    "errorMessage": "حدث خطأ ما. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.",
    "brandNameRequired": "اسم الماركة مطلوب",
    "phoneRequired": "رقم الهاتف مطلوب",
    "phoneInvalid": "يرجى إدخال رقم هاتف مصري صحيح",
    "volumeRequired": "يرجى اختيار حجم شحناتك الشهري",
    "urlInvalid": "يرجى إدخال رابط صحيح (يبدأ بـ https://)"
  },
  "footer": {
    "tagline": "سريع. موثوق. مصمم للبائعين.",
    "copyright": "© 2024 بانثر إكسبريس. جميع الحقوق محفوظة.",
    "privacy": "سياسة الخصوصية",
    "terms": "شروط الخدمة",
    "contact": "تواصل معنا"
  }
}
```

- [ ] **Step 8: Commit i18n setup**

```bash
git add -A
git commit -m "feat: add next-intl bilingual EN/AR setup with RTL support and full message files"
```

---

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

### Task 4: Google Sheets Integration + Leads API Route

**Files:**
- Create: `lib/lead-schema.ts`
- Create: `lib/google-sheets.ts`
- Create: `app/api/leads/route.ts`

**Interfaces:**
- Produces: `LeadSubmission` Zod type; `appendLeadToSheet(data: LeadSubmission): Promise<void>`; `POST /api/leads` returning `{ success: true }` or `{ error: string, status: 400|500 }`

- [ ] **Step 1: Create lead validation schema**

Create `lib/lead-schema.ts`:

```typescript
import { z } from 'zod'

export const LeadSubmissionSchema = z.object({
  brandName: z.string().min(1),
  phone: z
    .string()
    .min(1)
    .regex(/^(\+20|0020|0)?1[0125][0-9]{8}$/, 'Invalid Egyptian phone number'),
  volumeCategory: z.enum(['300', '1000', '5000', '5000plus']),
  socialLink:  z.union([z.string().url(), z.literal('')]).optional(),
  websiteUrl:  z.union([z.string().url(), z.literal('')]).optional(),
  referrerUrl: z.string().optional().default(''),
  landingUrl:  z.string().optional().default(''),
  utmSource:   z.string().optional().default(''),
  utmMedium:   z.string().optional().default(''),
  utmCampaign: z.string().optional().default(''),
  utmTerm:     z.string().optional().default(''),
  utmContent:  z.string().optional().default(''),
  userAgent:   z.string().optional().default(''),
  submittedAt: z.string().optional(),
  website_confirm: z.string().max(0).optional(),
})

export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>
```

- [ ] **Step 2: Create Google Sheets utility**

Create `lib/google-sheets.ts`:

```typescript
import { google } from 'googleapis'
import { env } from './env'
import type { LeadSubmission } from './lead-schema'

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.google.serviceAccountEmail,
      private_key: env.google.privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const authClient = await auth.getClient()
  return google.sheets({ version: 'v4', auth: authClient as Parameters<typeof google.sheets>[0]['auth'] })
}

export async function appendLeadToSheet(data: LeadSubmission): Promise<void> {
  const sheets = await getSheetsClient()
  const row = [
    data.submittedAt ?? new Date().toISOString(),
    data.brandName,
    data.phone,
    data.volumeCategory,
    data.socialLink  ?? '',
    data.websiteUrl  ?? '',
    data.referrerUrl ?? '',
    data.landingUrl  ?? '',
    data.utmSource   ?? '',
    data.utmMedium   ?? '',
    data.utmCampaign ?? '',
    data.utmTerm     ?? '',
    data.utmContent  ?? '',
    data.userAgent   ?? '',
  ]
  await sheets.spreadsheets.values.append({
    spreadsheetId: env.google.sheetId,
    range: 'Sheet1!A:N',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}
```

- [ ] **Step 3: Create Leads API route**

Create `app/api/leads/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { LeadSubmissionSchema } from '@/lib/lead-schema'
import { appendLeadToSheet } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website_confirm) {
      return NextResponse.json({ success: true })
    }

    const result = LeadSubmissionSchema.safeParse({
      ...body,
      userAgent:   request.headers.get('user-agent') ?? '',
      submittedAt: new Date().toISOString(),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: result.error.flatten() },
        { status: 400 }
      )
    }

    await appendLeadToSheet(result.data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[leads] submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit backend**

```bash
git add -A
git commit -m "feat: add Google Sheets integration, lead validation schema, and leads API route"
```

---

### Task 5: Placeholder SVG Logo + Logo Component

**Files:**
- Create: `public/logo.svg`
- Create: `components/ui/Logo.tsx`

**Interfaces:**
- Produces: `<Logo locale className? size? />` where `size` is `'sm' | 'md' | 'lg'`

- [ ] **Step 1: Create placeholder SVG logo**

Create `public/logo.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 56" fill="none">
  <path d="M10 28 L24 10 L36 20 L32 28 L36 36 L24 46 Z" fill="#E5001A"/>
  <path d="M32 28 L50 22 L54 28 L50 34 Z" fill="#E5001A" opacity="0.65"/>
  <path d="M38 24 L56 22" stroke="#E5001A" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
  <path d="M38 28 L60 28" stroke="#E5001A" stroke-width="2.5" stroke-linecap="round" opacity="0.55"/>
  <path d="M38 32 L56 34" stroke="#E5001A" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
  <text x="68" y="35" font-family="Inter,system-ui,sans-serif" font-size="20" font-weight="800" fill="#0A0A0A" letter-spacing="-0.5">PANTHER</text>
  <text x="68" y="48" font-family="Inter,system-ui,sans-serif" font-size="9.5" font-weight="600" fill="#E5001A" letter-spacing="4">EXPRESS</text>
</svg>
```

- [ ] **Step 2: Create Logo component**

Create `components/ui/Logo.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  locale: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean
}

const sizes = { sm: [120, 34], md: [160, 45], lg: [200, 56] } as const

export function Logo({ locale, className = '', size = 'md', dark = false }: LogoProps) {
  const [w, h] = sizes[size]
  return (
    <Link href={`/${locale}`} className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Panther Express"
        width={w}
        height={h}
        priority
        className={dark ? 'invert' : ''}
      />
    </Link>
  )
}
```

- [ ] **Step 3: Commit logo**

```bash
git add -A
git commit -m "feat: add placeholder SVG logo and Logo component"
```

---

### Task 6: Header + Footer Layout Components

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `Logo` from `@/components/ui/Logo`; `useTranslations('nav')`, `useTranslations('footer')` from next-intl; `sellerPortalUrl: string` prop
- Produces: `<Header sellerPortalUrl />`, `<Footer />`

- [ ] **Step 1: Create Header component**

Create `components/layout/Header.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'

const NAV_SECTIONS = ['services', 'about', 'clients', 'branches', 'partners'] as const

interface HeaderProps {
  sellerPortalUrl: string
}

export function Header({ sellerPortalUrl }: HeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const otherLocale = locale === 'en' ? 'ar' : 'en'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-panther-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo locale={locale} size="md" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`} className="text-sm font-medium text-white/65 hover:text-white transition-colors">
                {t(s)}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href={switchPath} className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors px-1">
              {otherLocale === 'ar' ? 'العربية' : 'English'}
            </Link>
            <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"
                className="border-white/25 text-white hover:bg-white/8 bg-transparent h-9 px-4 text-sm">
                {t('sellerLogin')}
              </Button>
            </a>
            <a href="#join">
              <Button size="sm" className="bg-panther-red hover:bg-panther-red-dark text-white h-9 px-5 text-sm font-semibold">
                {t('becomeASeller')}
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-white p-1.5" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-panther-black border-t border-white/8">
          <div className="px-4 py-5 flex flex-col gap-1">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`} onClick={() => setOpen(false)}
                className="text-white/75 hover:text-white py-2.5 text-base border-b border-white/5 last:border-0">
                {t(s)}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link href={switchPath} className="text-white/50 hover:text-white text-sm">
                {otherLocale === 'ar' ? 'العربية' : 'English'}
              </Link>
              <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-white/25 text-white hover:bg-white/8 bg-transparent">
                  {t('sellerLogin')}
                </Button>
              </a>
              <a href="#join" onClick={() => setOpen(false)}>
                <Button className="w-full bg-panther-red hover:bg-panther-red-dark text-white font-semibold">
                  {t('becomeASeller')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Create Footer component**

Create `components/layout/Footer.tsx`:

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-panther-black border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo locale={locale} size="md" />
            <p className="text-white/35 text-sm">{t('tagline')}</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="#" className="text-white/35 hover:text-white/60 text-sm transition-colors">{t('privacy')}</a>
            <a href="#" className="text-white/35 hover:text-white/60 text-sm transition-colors">{t('terms')}</a>
            <a href="#" className="text-white/35 hover:text-white/60 text-sm transition-colors">{t('contact')}</a>
          </div>
        </div>
        <div className="border-t border-white/8 mt-8 pt-6 text-center">
          <p className="text-white/25 text-xs">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit layout components**

```bash
git add -A
git commit -m "feat: add Header (scrolled, mobile drawer, language toggle) and Footer components"
```

---

### Task 7: Hero Section

**Files:**
- Create: `components/sections/Hero.tsx`

**Interfaces:**
- Consumes: `useTranslations('hero')`, `sellerPortalUrl: string`
- Produces: `<HeroSection sellerPortalUrl />`

- [ ] **Step 1: Create Hero section**

Create `components/sections/Hero.tsx`:

```tsx
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  sellerPortalUrl: string
}

export function HeroSection({ sellerPortalUrl }: HeroSectionProps) {
  const t = useTranslations('hero')

  return (
    <section className="relative min-h-screen bg-panther-black flex items-center overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#E5001A 1px, transparent 1px), linear-gradient(90deg, #E5001A 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        {/* Speed lines */}
        <div className="absolute top-[38%] left-0 w-3/4 h-px bg-gradient-to-r from-transparent via-panther-red/25 to-transparent" />
        <div className="absolute top-[50%] left-0 w-full h-px bg-gradient-to-r from-transparent via-panther-red/15 to-transparent" />
        <div className="absolute top-[62%] left-0 w-2/3 h-px bg-gradient-to-r from-transparent via-panther-red/10 to-transparent" />
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-48 w-[480px] h-[480px] bg-panther-red/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[320px] h-[320px] bg-panther-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-8">
            <Zap size={13} className="text-panther-red" />
            <span className="text-panther-red text-sm font-medium">{t('badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.04] tracking-tight mb-6 whitespace-pre-line">
            {t('headline')}
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white/55 leading-relaxed mb-10 max-w-2xl">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#join">
              <Button size="lg"
                className="bg-panther-red hover:bg-panther-red-dark text-white font-bold px-8 text-base group w-full sm:w-auto">
                {t('ctaPrimary')}
                <ArrowRight size={18} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </Button>
            </a>
            <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline"
                className="border-white/25 text-white hover:bg-white/5 bg-transparent font-medium px-8 text-base w-full sm:w-auto">
                {t('ctaSecondary')}
              </Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-6">
            {(['1', '2', '3'] as const).map((n) => (
              <div key={n}>
                <div className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">
                  {t(`stat${n}Value` as `stat${typeof n}Value`)}
                </div>
                <div className="text-xs text-white/40 font-semibold uppercase tracking-widest">
                  {t(`stat${n}Label` as `stat${typeof n}Label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit Hero**

```bash
git add -A
git commit -m "feat: add Hero section with grid accents, speed lines, headline, CTAs, and stats"
```

---

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

### Task 11: Lead Capture Form

**Files:**
- Create: `components/sections/LeadForm.tsx`

**Interfaces:**
- Consumes: `POST /api/leads`; `LeadSubmissionSchema` from `@/lib/lead-schema`; `useTranslations('leadForm')`
- Produces: `<LeadFormSection />`

- [ ] **Step 1: Create Lead Form section**

Create `components/sections/LeadForm.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { LeadSubmissionSchema, type LeadSubmission } from '@/lib/lead-schema'

const VOLUME_KEYS = ['300', '1000', '5000', '5000plus'] as const

function readUTMs() {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utmSource:   p.get('utm_source')   ?? '',
    utmMedium:   p.get('utm_medium')   ?? '',
    utmCampaign: p.get('utm_campaign') ?? '',
    utmTerm:     p.get('utm_term')     ?? '',
    utmContent:  p.get('utm_content')  ?? '',
  }
}

export function LeadFormSection() {
  const t = useTranslations('leadForm')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [attribution, setAttribution] = useState<Record<string, string>>({})

  useEffect(() => {
    setAttribution({
      referrerUrl: document.referrer,
      landingUrl:  window.location.href,
      ...readUTMs(),
    })
  }, [])

  const form = useForm<LeadSubmission>({
    resolver: zodResolver(LeadSubmissionSchema),
    defaultValues: { brandName: '', phone: '', socialLink: '', websiteUrl: '', website_confirm: '' },
  })

  const onSubmit = async (values: LeadSubmission) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...attribution }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="join" className="bg-panther-red py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <CheckCircle2 size={60} className="text-white mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl font-black text-white mb-3">{t('successTitle')}</h2>
          <p className="text-white/75 text-lg">{t('successMessage')}</p>
        </div>
      </section>
    )
  }

  const fieldClass = 'bg-white/10 border-white/25 text-white placeholder:text-white/35 focus-visible:ring-white/30 focus-visible:border-white/60'
  const errorClass = 'text-white/75 text-xs mt-1'

  return (
    <section id="join" className="bg-panther-red py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-white/15 rounded-full px-4 py-1.5 mb-5">
            <span className="text-white text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-3">{t('title')}</h2>
          <p className="text-white/70 text-lg">{t('subtitle')}</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-7 sm:p-9 space-y-5"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Honeypot */}
          <input type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" {...form.register('website_confirm')} />

          {/* Brand name */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('brandName')} <span className="text-white/50">*</span></Label>
            <Input placeholder={t('brandNamePlaceholder')} className={fieldClass} {...form.register('brandName')} />
            {form.formState.errors.brandName && <p className={errorClass}>{t('brandNameRequired')}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('phone')} <span className="text-white/50">*</span></Label>
            <Input type="tel" placeholder={t('phonePlaceholder')} className={fieldClass} dir="ltr" {...form.register('phone')} />
            {form.formState.errors.phone && (
              <p className={errorClass}>
                {form.formState.errors.phone.type === 'too_small' ? t('phoneRequired') : t('phoneInvalid')}
              </p>
            )}
          </div>

          {/* Volume */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('volume')} <span className="text-white/50">*</span></Label>
            <Select onValueChange={(v) => form.setValue('volumeCategory', v as LeadSubmission['volumeCategory'], { shouldValidate: true })}>
              <SelectTrigger className={`${fieldClass} h-10`}>
                <SelectValue placeholder={t('volumePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {VOLUME_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>{t(`volume${k}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.volumeCategory && <p className={errorClass}>{t('volumeRequired')}</p>}
          </div>

          {/* Social */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('social')}</Label>
            <Input type="url" placeholder={t('socialPlaceholder')} className={fieldClass} dir="ltr" {...form.register('socialLink')} />
            {form.formState.errors.socialLink && <p className={errorClass}>{t('urlInvalid')}</p>}
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('website')}</Label>
            <Input type="url" placeholder={t('websitePlaceholder')} className={fieldClass} dir="ltr" {...form.register('websiteUrl')} />
            {form.formState.errors.websiteUrl && <p className={errorClass}>{t('urlInvalid')}</p>}
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-2.5 bg-white/15 border border-white/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-white shrink-0 mt-0.5" />
              <p className="text-white text-sm">{t('errorMessage')}</p>
            </div>
          )}

          <Button type="submit" disabled={status === 'loading'}
            className="w-full bg-panther-black hover:bg-panther-dark text-white font-bold py-3 text-base rounded-xl transition-all disabled:opacity-60 mt-2">
            {status === 'loading' ? t('submitting') : t('submit')}
          </Button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit Lead Form**

```bash
git add -A
git commit -m "feat: add LeadFormSection with Zod validation, UTM attribution, and honeypot"
```

---

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
