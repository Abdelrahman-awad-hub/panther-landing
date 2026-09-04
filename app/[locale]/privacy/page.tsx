import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { env } from '@/lib/env'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const language = locale === 'ar' ? 'ar' : 'en'
  return {
    title: language === 'ar' ? 'سياسة الخصوصية — بانثر إكسبريس' : 'Privacy Policy — Panther Express',
    alternates: {
      canonical: `/${language}/privacy`,
      languages: { ar: '/ar/privacy', en: '/en/privacy' },
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const isAr = locale === 'ar'
  return (
    <>
      <Header sellerPortalUrl={env.sellerPortalUrl} />
      <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28 sm:pt-32" dir={isAr ? 'rtl' : 'ltr'}>
        <article className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-black text-zinc-950">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
          <p className="mt-5 leading-7 text-zinc-600">
            {isAr
              ? 'تستخدم بانثر إكسبريس البيانات التي ترسلها عبر الموقع للتواصل معك، تقييم احتياجات الشحن، تقديم الخدمة، قياس أداء الموقع والحملات، وتحسين تجربة العملاء.'
              : 'Panther Express uses information submitted through this website to contact you, assess shipping needs, provide services, measure website and campaign performance, and improve customer experience.'}
          </p>
          <h2 className="mt-8 text-xl font-bold text-zinc-950">{isAr ? 'البيانات التي نجمعها' : 'Information we collect'}</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            {isAr
              ? 'قد تشمل اسم البراند، رقم الهاتف، المحافظة، حجم الشحن، الروابط التي تضيفها، وبيانات تقنية وبيانات مصدر الزيارة اللازمة لتشغيل الخدمة وقياس النتائج.'
              : 'This may include brand name, phone number, governorate, shipment volume, links you provide, and technical and visit-attribution data needed to operate the service and measure results.'}
          </p>
          <h2 className="mt-8 text-xl font-bold text-zinc-950">{isAr ? 'المشاركة والحماية' : 'Sharing and protection'}</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            {isAr
              ? 'لا نبيع بياناتك. قد نستخدم مزودي خدمة موثوقين لتخزين الطلبات وقياس الأداء، مع تقليل البيانات وحمايتها قدر الإمكان. تُرسل بيانات المطابقة الإعلانية الحساسة من الخادم بصورة مشفرة عند استخدامها.'
              : 'We do not sell your information. Trusted providers may be used to store applications and measure performance with data minimization and appropriate safeguards. Sensitive advertising matching data is hashed server-side when used.'}
          </p>
          <h2 className="mt-8 text-xl font-bold text-zinc-950">{isAr ? 'التواصل معنا' : 'Contact us'}</h2>
          <p className="mt-3 leading-7 text-zinc-600">
            {isAr ? 'للاستفسار أو طلب تحديث أو حذف بياناتك، تواصل معنا عبر ' : 'For questions or to request access, correction, or deletion, contact us at '}
            <a className="font-semibold text-panther-red underline" href="mailto:sales@panther-express.com">sales@panther-express.com</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
