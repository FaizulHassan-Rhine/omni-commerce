/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    '!./components/ui/PlatformBrandIcons.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3D6B8E',
          secondary: '#5A8F7B',
          accent: '#6B9AC4',
          muted: '#E8EEF3',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C2129',
          'dark-secondary': '#242A33',
        },
        bg: {
          light: '#F5F7FA',
          dark: '#0F1218',
        },
        sidebar: {
          light: '#FFFFFF',
          dark: '#161A22',
        },
        text: {
          primary: '#1A2332',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3D6B8E 0%, #4A7C9B 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, rgba(61,107,142,0.06) 0%, rgba(90,143,123,0.06) 100%)',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(26, 35, 50, 0.04), 0 4px 16px rgba(26, 35, 50, 0.06)',
        card: '0 1px 2px rgba(26, 35, 50, 0.04), 0 2px 8px rgba(26, 35, 50, 0.04)',
        header: '0 1px 0 rgba(26, 35, 50, 0.06)',
        glow: '0 0 24px rgba(61, 107, 142, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
