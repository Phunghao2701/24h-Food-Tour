/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          black: '#000000',
          white: '#ffffff',
        },
        warm: {
          cream: '#faf9f7',
          silver: '#9f9b93',
          charcoal: '#55534e',
        },
        dark: {
          charcoal: '#333333',
        },
        oat: {
          border: '#dad4c8',
          light: '#eee9df',
        },
        cool: {
          border: '#e6e8ec',
        },
        light: {
          frost: '#eff1f3',
        },
        matcha: {
          300: '#84e7a5',
          600: '#078a52',
          800: '#02492a',
        },
        slushie: {
          500: '#3bd3fd',
          800: '#0089ad',
        },
        lemon: {
          400: '#f8cc65',
          500: '#fbbd41',
          700: '#d08a11',
          800: '#9d6a09',
        },
        ube: {
          300: '#c1b0ff',
          800: '#43089f',
          900: '#32037d',
        },
        pomegranate: {
          400: '#fc7981',
        },
        blueberry: {
          800: '#01418d',
        },
        badge: {
          bluebg: '#f0f8ff',
          bluetext: '#3859f9',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'], // Alternative for Roobert
        mono: ['Space Mono', 'monospace'],
      },
      letterSpacing: {
        'display-tight': '-3.2px',
        'display-mid': '-2.4px',
        'heading-tight': '-1.32px',
        'sub-tight': '-0.64px',
        'tight-sm': '-0.16px',
        'wide-label': '1.08px',
      },
      lineHeight: {
        'display': '1.00',
        'tight': '1.10',
        'ui': '1.50',
        'relaxed': '1.60',
      },
      boxShadow: {
        'clay': 'rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px',
        'clay-hover': 'rgb(0,0,0) -7px 7px',
      },
      borderRadius: {
        'sharp': '4px',
        'standard': '8px',
        'badge': '11px',
        'card': '12px',
        'feature': '24px',
        'section': '40px',
        'pill': '1584px',
      }
    },
  },
  plugins: [],
}