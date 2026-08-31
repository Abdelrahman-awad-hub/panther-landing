import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/Hero'
import { TrustedBrandsStrip } from '@/components/sections/TrustedBrandsStrip'
import { AboutSection } from '@/components/sections/About'
import { ServicesSection } from '@/components/sections/Services'
import { WarehousingSection } from '@/components/sections/Warehousing'
import { ShopifyIntegrationSection } from '@/components/sections/ShopifyIntegration'
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
        <TrustedBrandsStrip />
        <LeadFormSection id="join" source="mid_page" />
        <AboutSection />
        <ServicesSection />
        <WarehousingSection />
        <ShopifyIntegrationSection />
        <SellerHighlightsSection sellerPortalUrl={sellerPortalUrl} />
        <LeadFormSection id="join-bottom" source="bottom_page" />
      </main>
      <SellerCTA />
      <SocialDock />
      <Footer />
    </>
  )
}
