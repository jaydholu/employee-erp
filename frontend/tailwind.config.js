/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", 'sans-serif'],
        mono: ["DM Mono", 'monospace'],
      },
      fontSize: {
        xs:    ['0.8rem',  { lineHeight: '1.2rem'  }],
        sm:    ['0.95rem', { lineHeight: '1.45rem' }],
        base:  ['1.05rem', { lineHeight: '1.65rem' }],
        lg:    ['1.2rem',  { lineHeight: '1.8rem'  }],
        xl:    ['1.35rem', { lineHeight: '1.95rem' }],
        '2xl': ['1.6rem',  { lineHeight: '2.1rem'  }],
        '3xl': ['2rem',    { lineHeight: '2.4rem'  }],
        '4xl': ['2.5rem',  { lineHeight: '1.1'     }],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
}
