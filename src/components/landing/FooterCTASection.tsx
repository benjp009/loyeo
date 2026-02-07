'use client'

import { useState } from 'react'

export function FooterCTASection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // TODO: Integrate with Supabase or email service
    // For now, simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <section
      className="bg-navy px-4 py-16 md:py-24"
      data-section="footer-cta"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="font-sora text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Prêt à fidéliser vos clients ?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Créez votre programme de fidélité en quelques minutes. Sans engagement.
          </p>
        </div>

        <div className="mt-10">
          {isSubmitted ? (
            <div className="mx-auto max-w-md rounded-xl bg-white/10 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral">
                <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="mt-4 font-sora text-xl font-semibold text-white">
                Merci !
              </h3>
              <p className="mt-2 text-white/70">
                Nous vous contacterons très bientôt pour créer votre programme.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md">
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="min-h-[48px] flex-1 rounded-lg border-0 bg-white px-4 py-3 text-navy placeholder:text-text-grey focus:outline-none focus:ring-2 focus:ring-coral"
                  data-input="footer-email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-[48px] rounded-lg bg-coral px-8 py-3 font-medium text-white transition-colors hover:bg-coral/90 disabled:opacity-50"
                  data-cta="footer-submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi...
                    </span>
                  ) : (
                    'Créer mon programme'
                  )}
                </button>
              </div>
              <p className="mt-4 text-center text-sm text-white/50">
                En vous inscrivant, vous acceptez nos CGV et notre politique de confidentialité.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer links */}
      <div className="mx-auto mt-16 max-w-4xl border-t border-white/10 pt-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral">
              <span className="font-sora text-sm font-bold text-white">L</span>
            </div>
            <span className="font-sora text-lg font-bold text-white">Loyeo</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <a href="/cgv" className="hover:text-white transition-colors">CGV</a>
            <a href="/cgu" className="hover:text-white transition-colors">CGU</a>
            <a href="/privacy" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="mailto:contact@loyeo.fr" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Copyright */}
          <p className="font-space-mono text-sm text-white/50">
            © 2026 Loyeo
          </p>
        </div>
      </div>
    </section>
  )
}
