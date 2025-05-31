import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pagan/nature themed color palette
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          500: '#87a96b',
          600: '#6b8a4f',
          700: '#5a7142',
        },
        earth: {
          50: '#faf9f7',
          100: '#f0ede6',
          500: '#8b7355',
          600: '#6d5940',
          700: '#5c4a35',
        },
        moonstone: {
          50: '#f8fafc',
          100: '#e2e9f0',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
        },
        ritual: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
        }
      },
      fontFamily: {
        serif: ['Crimson Text', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
} satisfies Config