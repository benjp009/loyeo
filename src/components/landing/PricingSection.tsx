'use client'

const plans = [
  {
    name: 'Starter',
    price: 29,
    firstPayment: 87,
    description: 'Pour démarrer votre programme de fidélité',
    features: [
      'Jusqu\'à 500 clients',
      'Carte Apple & Google Wallet',
      'Notifications WhatsApp',
      'QR code personnalisé',
      'Tableau de bord commerçant',
      'Support par email',
    ],
    cta: 'Commencer avec Starter',
    popular: false,
  },
  {
    name: 'Pro',
    price: 49,
    firstPayment: 147,
    description: 'Pour les commerces en croissance',
    features: [
      'Clients illimités',
      'Tout Starter inclus',
      'Campagnes marketing',
      'Statistiques avancées',
      'Multi-programmes',
      'Support prioritaire',
    ],
    cta: 'Choisir Pro',
    popular: true,
  },
]

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-cream px-4 py-16 md:py-24"
      data-section="pricing"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-sora text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
            Des tarifs simples et transparents
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-grey">
            Sans frais cachés. Sans engagement de durée après la période initiale.
          </p>

          {/* Competitor comparison */}
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-coral/10 px-4 py-2">
            <span className="font-space-mono text-sm text-coral">
              Zerosix: €49/mois + €190 frais d&apos;installation
            </span>
            <span className="text-sm text-text-grey">— Nous: €0 frais d&apos;installation</span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg md:p-8 ${
                plan.popular ? 'border-coral' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-coral px-4 py-1 font-space-mono text-xs font-medium uppercase tracking-wider text-white">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="font-sora text-xl font-bold text-navy">{plan.name}</h3>
                <p className="mt-2 text-text-grey">{plan.description}</p>

                <div className="mt-6">
                  <span className="font-sora text-4xl font-bold text-navy md:text-5xl">
                    €{plan.price}
                  </span>
                  <span className="text-text-grey">/mois</span>
                </div>

                {/* Billing transparency - key council decision */}
                <div className="mt-3 rounded-lg bg-cream p-3">
                  <p className="font-space-mono text-sm text-navy">
                    Engagement 3 mois — Premier paiement: €{plan.firstPayment}
                  </p>
                </div>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-coral" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span className="text-navy">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <a
                  href="/signup"
                  className={`flex min-h-[48px] w-full items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors ${
                    plan.popular
                      ? 'bg-coral text-white hover:bg-coral/90'
                      : 'border-2 border-coral text-coral hover:bg-coral/10'
                  }`}
                  data-cta={`pricing-${plan.name.toLowerCase()}`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-center">
          <div className="flex items-center gap-2 text-text-grey">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            <span className="font-space-mono text-sm">Paiement sécurisé CB</span>
          </div>
          <div className="flex items-center gap-2 text-text-grey">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-space-mono text-sm">Conforme RGPD</span>
          </div>
          <div className="flex items-center gap-2 text-text-grey">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3a3.78 3.78 0 01-1.653-.712 2.58 2.58 0 01-.925-1.2.75.75 0 011.395-.55c.12.3.303.545.447.563a2.19 2.19 0 00.736.363v-2.697a3.778 3.778 0 01-1.96-.696C5.505 9.616 5 8.86 5 8c0-.86.504-1.616 1.29-2.13a3.78 3.78 0 011.96-.696V4.75A.75.75 0 019.25 4h1.5z" clipRule="evenodd" />
            </svg>
            <span className="font-space-mono text-sm">Sans frais cachés</span>
          </div>
        </div>
      </div>
    </section>
  )
}
