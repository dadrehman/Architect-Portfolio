/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#14151a',         // Nearly black - architectural elegance
        'secondary': '#97999b',       // Sophisticated gray
        'accent': '#dcb286',          // Warm brass/copper tone
        'accent-dark': '#a77d54',     // Darker variant of accent
        'light': '#f9f9f9',           // Off-white
        'dark': '#1a1a1a',            // Dark for contrast
        'neutral-100': '#f5f5f5',
        'neutral-200': '#e5e5e5',
        'neutral-300': '#d4d4d4',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],    // Clean geometric font
        'serif': ['Cormorant Garamond', 'serif'], // Elegant serif
        'display': ['Tenez', 'serif'],           // High-contrast display font
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      letterSpacing: {
        'tightest': '-0.06em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.15em',
      },
      lineHeight: {
        'tighter': '1.1',
        'tight': '1.25',
        'relaxed': '1.625',
        'loose': '2',
      },
      borderWidth: {
        'hairline': '0.5px',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'intense': '0 10px 50px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}