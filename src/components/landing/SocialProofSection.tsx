'use client'

export function SocialProofSection() {
  return (
    <section
      className="bg-white px-4 py-16 md:py-24"
      data-section="social-proof"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-sora text-2xl font-bold text-navy sm:text-3xl md:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-grey">
            Rejoignez les commerçants qui fidélisent autrement.
          </p>
        </div>

        {/* Testimonial card - Marie placeholder per council decision */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-2xl border border-gray-100 bg-cream p-6 shadow-sm md:p-8">
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
              {/* Photo placeholder - authentic bakery setting */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-coral/20 md:h-24 md:w-24">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-sora text-2xl font-bold text-coral">M</span>
                </div>
              </div>

              <div className="flex-1">
                {/* Quote */}
                <svg className="mx-auto mb-4 h-8 w-8 text-coral/30 md:mx-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <blockquote className="text-lg text-navy md:text-xl">
                  Depuis que j&apos;utilise Loyeo, mes clients reviennent plus souvent.
                  La carte dans leur téléphone, c&apos;est simple — pas besoin de leur expliquer.
                </blockquote>

                <div className="mt-6">
                  <p className="font-sora font-semibold text-navy">Marie D.</p>
                  <p className="text-text-grey">Boulangerie des Halles, Lyon</p>
                  <p className="mt-1 font-space-mono text-sm text-coral">
                    Cliente depuis 8 mois
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats / Social proof metrics */}
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          <div className="text-center">
            <p className="font-sora text-3xl font-bold text-coral md:text-4xl">50+</p>
            <p className="mt-1 text-sm text-text-grey">Commerçants pilotes</p>
          </div>
          <div className="text-center">
            <p className="font-sora text-3xl font-bold text-coral md:text-4xl">2,500+</p>
            <p className="mt-1 text-sm text-text-grey">Cartes créées</p>
          </div>
          <div className="text-center">
            <p className="font-sora text-3xl font-bold text-coral md:text-4xl">+35%</p>
            <p className="mt-1 text-sm text-text-grey">Retours clients</p>
          </div>
          <div className="text-center">
            <p className="font-sora text-3xl font-bold text-coral md:text-4xl">30s</p>
            <p className="mt-1 text-sm text-text-grey">Inscription client</p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          {/* Apple Wallet */}
          <div className="flex items-center gap-2 text-text-grey">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="font-space-mono text-sm">Apple Wallet</span>
          </div>

          {/* Google Wallet */}
          <div className="flex items-center gap-2 text-text-grey">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-space-mono text-sm">Google Wallet</span>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center gap-2 text-text-grey">
            <svg className="h-8 w-8 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="font-space-mono text-sm">WhatsApp Business</span>
          </div>
        </div>
      </div>
    </section>
  )
}
