import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        tablet: '640px',
        desktop: '1024px',
        wide: '1440px',
      },
      colors: {
        primary: "#0E5E6F",
        secondary: "#FFD1BB",
        success: "#00C1A3",
        background: "#F2F5F8",
        surface: "#FFFFFF",
        critical: "#B43219",
        "on-surface": "#181C20",
        "on-surface-variant": "#3F484C",
        "outline": "#6F787D",
        "outline-variant": "#BFC8CD",
        // Keeping some blueprint surface variants for compatibility during transition
        "surface-container-highest": "#E5E8EE",
        "surface-container-high": "#EBEEF4",
        "surface-container": "#F2F5F8",
        "surface-container-low": "#F7F9FF",
        "surface-container-lowest": "#FFFFFF",
        brand: {
          50: '#F0F9FA',
          100: '#E0F2F5',
          200: '#BFE3EC',
          300: '#8FCEE0',
          400: '#5FB6CF',
          500: '#0E5E6F',
          600: '#0C505E',
          700: '#0A424F',
          800: '#08343E',
          900: '#06262F',
        },
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "1rem", // Updated to 16px to match constitution
        "2xl": "1rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Inter", "sans-serif"], // Stitch says Inter or Instrument Sans
        "display": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"],
        "sans": ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.05)', // Match constitution soft shadows
        'card-hover': '0 8px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
