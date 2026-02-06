import type { Config } from 'tailwindcss';
import sharedConfig from '@loyeo/config/tailwind';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [sharedConfig as Config],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
