import {
  HeroSection,
  HowItWorksSection,
  PricingSection,
  SocialProofSection,
  FooterCTASection,
} from '@/components/landing'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <SocialProofSection />
      <FooterCTASection />
    </main>
  )
}
