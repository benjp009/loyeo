'use client'

export function HeroSection() {
  return (
    <section
      className="min-h-screen bg-cream px-4 py-16 md:py-24"
      data-section="hero"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left lg:gap-12">
          {/* Content */}
          <div className="flex-1">
            <h1 className="font-sora text-3xl font-bold leading-tight text-navy sm:text-4xl md:text-5xl lg:text-6xl">
              Vos clients oublient de revenir ?
            </h1>
            <p className="mt-4 text-lg text-text-grey sm:text-xl md:mt-6 md:text-2xl">
              Loyeo ramène vos clients avec des cartes de fidélité dans leur téléphone.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#pricing"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-coral px-8 py-3 font-medium text-white transition-colors hover:bg-coral/90 sm:w-auto"
                data-cta="hero-primary"
              >
                Essayer gratuitement
              </a>
              <span className="font-space-mono text-sm text-text-grey">
                Sans engagement
              </span>
            </div>
          </div>

          {/* Wallet Pass Mockup */}
          <div className="mt-12 flex-1 lg:mt-0">
            <div className="mx-auto max-w-[280px] sm:max-w-[320px]">
              {/* iPhone Frame */}
              <div className="relative rounded-[2.5rem] bg-navy p-3 shadow-2xl">
                <div className="absolute left-1/2 top-6 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
                <div className="rounded-[2rem] bg-white p-4">
                  {/* Wallet Pass Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-coral to-coral/80 p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-space-mono text-xs uppercase tracking-wider opacity-80">
                          Carte de fidélité
                        </p>
                        <p className="mt-1 font-sora text-lg font-bold">
                          Boulangerie Martin
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-white/20 p-2">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="font-space-mono text-xs uppercase tracking-wider opacity-80">
                        Vos tampons
                      </p>
                      <div className="mt-2 flex gap-2">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-6 w-6 rounded-full border-2 border-white/40 ${i < 7 ? 'bg-white' : ''}`}
                          />
                        ))}
                      </div>
                      <p className="mt-3 font-sora text-2xl font-bold">
                        7 / 10
                      </p>
                    </div>

                    <div className="mt-6 rounded-lg bg-white/20 p-3 text-center">
                      <p className="text-sm font-medium">
                        Encore 3 visites pour votre croissant offert !
                      </p>
                    </div>
                  </div>

                  {/* Apple Wallet indicator */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-text-grey">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="font-space-mono text-xs">Apple Wallet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
