import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0a0a0f',
          surface: '#1a1a2e',
          light: '#f5f5f7',
        },
        primary: {
          DEFAULT: '#00ff88',
          dark: '#00cc6f',
          light: '#39ffaa',
        },
        secondary: {
          DEFAULT: '#0099ff',
          dark: '#0077cc',
        },
        accent: {
          DEFAULT: '#ff0080',
          red: '#ff004d',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
export default config
