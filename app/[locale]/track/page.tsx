import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SocialDock } from '@/components/ui/SocialDock'
import { TrackOrder } from '@/components/track/TrackOrder'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Track Your Order — Panther Express',
  description: 'Enter your waybill number to see the latest status of your shipment.',
}

export default function TrackPage() {
  const sellerPortalUrl = env.sellerPortalUrl

  return (
    <>
      <Header sellerPortalUrl={sellerPortalUrl} />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-panther-black" />}>
          <TrackOrder />
        </Suspense>
      </main>
      <SocialDock />
      <Footer />
    </>
  )
}
