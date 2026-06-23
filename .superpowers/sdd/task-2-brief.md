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

