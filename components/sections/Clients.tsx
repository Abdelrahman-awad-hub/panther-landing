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
          <p className="text-zinc-500 max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {clients.map((client) => (
            <div key={client.id}
              className="bg-[#F9F8F7] border border-zinc-100 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-card hover:border-panther-red/20 transition-all group">
              <div className="w-14 h-14 bg-zinc-200/70 rounded-xl flex items-center justify-center mb-3 group-hover:bg-panther-red/8 transition-colors">
                <span className="text-2xl font-black text-zinc-400 group-hover:text-panther-red/50 transition-colors">
                  {client.name.charAt(0)}
                </span>
              </div>
              <p className="font-semibold text-panther-black text-sm">{client.name}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{client.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
