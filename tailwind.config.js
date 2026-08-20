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
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#112E81',
          secondary: '#4647AE',
          accent: '#4382DF',
          muted: '#AACCD6',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C2129',
          'dark-secondary': '#242A33',
        },
        bg: {
          light: '#F3F7F9',
          dark: '#0F1218',
        },
        sidebar: {
          light: '#FFFFFF',
          dark: '#161A22',
        },
        text: {
          primary: '#112E81',
          secondary: '#4647AE',
          muted: '#6B8A99',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #112E81 0%, #4647AE 52%, #4382DF 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, rgba(17,46,129,0.08) 0%, rgba(67,130,223,0.08) 100%)',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(17, 46, 129, 0.04), 0 4px 16px rgba(17, 46, 129, 0.06)',
        card: '0 1px 2px rgba(17, 46, 129, 0.04), 0 2px 8px rgba(17, 46, 129, 0.04)',
        header: '0 1px 0 rgba(17, 46, 129, 0.06)',
        glow: '0 0 24px rgba(67, 130, 223, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'float': 'floatY 3.2s ease-in-out infinite',
        'float-slow': 'floatY 4s ease-in-out infinite',
        'float-delayed': 'floatY 3.6s ease-in-out infinite 0.6s',
        'guardian-glow': 'guardianGlow 2.4s ease-in-out infinite',
        'guardian-ring': 'guardianRing 2.4s ease-out infinite',
        'guardian-burst': 'guardianBurst 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
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
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        guardianGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(17, 46, 129, 0.55), 0 8px 24px rgba(67, 130, 223, 0.35)' },
          '50%': { boxShadow: '0 0 0 10px rgba(17, 46, 129, 0), 0 8px 32px rgba(67, 130, 223, 0.55)' },
        },
        guardianRing: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.85)', opacity: '0' },
        },
        guardianBurst: {
          '0%': { transform: 'scale(0.08)', opacity: '0.9' },
          '70%': { opacity: '1' },
          '100%': { transform: 'scale(18)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
