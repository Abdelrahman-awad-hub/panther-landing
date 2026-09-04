import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { clients } from '@/data/clients'

export function TrustedBrandsStrip() {
  const t = useTranslations('trustedBrands')
  const logoClients = clients.filter((client) => client.logo)

  return (
    <section id="clients" className="border-b border-zinc-100 bg-white py-8" aria-label={t('title')}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
          {t('title')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {logoClients.map((client) => (
            <div key={client.id} className=" opacity-100 transition-transform duration-200 hover:scale-105 sm:w-24">
              <Image src={client.logo!} alt={client.name} width={200} height={200}  className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
