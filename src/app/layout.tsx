import type { Metadata } from 'next'
import { Sora, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: {
    default: 'Loyeo — La fidélité, simplifiée',
    template: '%s | Loyeo',
  },
  description:
    'Plateforme de fidélité digitale pour commerçants indépendants. Vos clients reviennent, votre commerce grandit.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="font-dm-sans">{children}</body>
    </html>
  )
}
