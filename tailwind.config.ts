import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: '#FF4D4D',
        navy: '#1A1A2E',
        cream: '#FFF8F0',
        'text-grey': '#8E8E93',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'Arial', 'Helvetica', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        'space-mono': ['var(--font-space-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}

export default config
