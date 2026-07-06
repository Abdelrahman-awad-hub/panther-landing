import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SocialDock } from '@/components/ui/SocialDock'
import { ContactUs } from '@/components/contact/ContactUs'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Contact Us — Panther Express',
  description: 'Get in touch with Panther Express — WhatsApp, email, and phone. Fast replies for quotes, partnerships, and support.',
}

export default function ContactPage() {
  const sellerPortalUrl = env.sellerPortalUrl

  return (
    <>
      <Header sellerPortalUrl={sellerPortalUrl} />
      <main>
        <ContactUs />
      </main>
      <SocialDock />
      <Footer />
    </>
  )
}
