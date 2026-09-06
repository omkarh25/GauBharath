import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // GauBharath brand palette: warm, sacred, earth-toned
        saffron: {
          50: '#FDF5EC',
          100: '#FAE6CF',
          200: '#F4C998',
          300: '#EAA65C',
          400: '#DE8431',
          500: '#D2691E',
          600: '#B55718',
          700: '#8E4214',
          800: '#6A3211',
          900: '#4A230C',
        },
        cream: {
          50: '#FAF6F0',
          100: '#F5E6D3',
          200: '#EBD2B0',
          300: '#DEB886',
        },
        forest: {
          50: '#EEF3E8',
          100: '#D5E2C5',
          200: '#A6C18B',
          300: '#7AA05C',
          400: '#558040',
          500: '#2D5016',
          600: '#264412',
          700: '#1E360F',
        },
        earth: {
          400: '#7A4F2A',
          500: '#5C3A1E',
          600: '#4A2E17',
          700: '#3A2410',
          800: '#281808',
          900: '#180D04',
        },
        ink: '#1A1410',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        kannada: ['var(--font-kannada)', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-2%, -2%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
