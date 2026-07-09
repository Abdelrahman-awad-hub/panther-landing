import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/Hero'
import { AboutSection } from '@/components/sections/About'
import { ServicesSection } from '@/components/sections/Services'
import { ShopifyIntegrationSection } from '@/components/sections/ShopifyIntegration'
import { ClientsSection } from '@/components/sections/Clients'
import { SellerHighlightsSection } from '@/components/sections/SellerHighlights'
import { LeadFormSection } from '@/components/sections/LeadForm'
import { SellerCTA } from '@/components/sections/SellerCTA'
import { SocialDock } from '@/components/ui/SocialDock'
import { env } from '@/lib/env'

export default function HomePage() {
  const sellerPortalUrl = env.sellerPortalUrl

  return (
    <>
      <Header sellerPortalUrl={sellerPortalUrl} />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ShopifyIntegrationSection />
        <ClientsSection />
        <SellerHighlightsSection sellerPortalUrl={sellerPortalUrl} />
        <LeadFormSection />
      </main>
      <SellerCTA />
      <SocialDock />
      <Footer />
    </>
  )
}
