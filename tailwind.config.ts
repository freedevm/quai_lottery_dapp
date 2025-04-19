import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin'

const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {},
      keyframes: {
        verticalTitlePossitiveCrossing: {
          "0%": { transform: "translateY(1000%)" },
          "60%": { transform: "translateY(1000%)" },
          "80%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(0%)" },
        },
        verticalTitleNegativeCrossing: {
          "0%": { transform: "translateY(-1000%)" },
          "60%": { transform: "translateY(-1000%)" },
          "80%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(0%)" },
        },
        verticalPossitiveCrossing: {
          "0%": { transform: "translateY(-150%)" },
          "40%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(0%)" },
        },
        verticalNegativeCrossing: {
          "0%": { transform: "translateY(150%)" },
          "40%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(0%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        fadeInOut: {
          "0%": { opacity: "0" },
          "20%": { opacity: "1" },
          "30%": { opacity: "1" },
          "40%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
        roundsFadeInOutOne: {
          "0%": { opacity: "0" },
          "40%": { opacity: "0" },
          "50%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        roundsFadeInOutTwo: {
          "0%": { opacity: "0" },
          "45%": { opacity: "0" },
          "55%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        roundsFadeInOutThree: {
          "0%": { opacity: "0" },
          "50%": { opacity: "0" },
          "60%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        ZoomIn: {
          "0%": { transform: "scale(3)", opacity: "0" },
          "85%": { transform: "scale(3)", opacity: "0" },
          "90%": { transform: "scale(1)", opacity: "1" },
          "95%": { transform: "scale(2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        swipeBtnFadeIn: {
          "0%": { opacity: "0" },
          "90%": { opacity: "0" },
          "95%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px 2.5px rgba(255, 75, 75, 0.5)" },
          "50%": { boxShadow: "0 0 10px 5px rgba(255, 75, 75, 0.8)" },
        },
        blinker: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        dimlight: {
          '0%, 18%, 20%, 50.1%, 60%, 65.1%, 80%, 90.1%, 92%': {
            color: '#A855F7',
            boxShadow: 'none',
          },
          '18.1%, 20.1%, 30%, 50%, 60.1%, 65%, 80.1%, 90%, 92.1%, 100%': {
            color: '#E9D5FF',
            textShadow: '0 0 10px #D8B4FE',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)', opacity: '1' },
          '100%': { transform: 'translateX(0%)', opacity: '0' },
        },
      },
      animation: {
        "vertical-title-possitive-crossing":
          "verticalTitlePossitiveCrossing 5s ease-in-out ",
        "vertical-title-negative-crossing":
          "verticalTitleNegativeCrossing 5s ease-in-out ",
        "vertical-possitive-crossing":
          "verticalPossitiveCrossing 5s ease-in-out ",
        "vertical-negative-crossing":
          "verticalNegativeCrossing 5s ease-in-out ",
        "fade-in": "fadeIn 5s ease-in-out",
        "fade-in-out": "fadeInOut 5s forwards",
        "rounds-fade-in-out-one": "roundsFadeInOutOne 5s forwards",
        "rounds-fade-in-out-two": "roundsFadeInOutTwo 5s forwards",
        "rounds-fade-in-out-three": "roundsFadeInOutThree 5s forwards",
        "zoom-in": "ZoomIn 5s forwards",
        "swipe-btn-fade-in": "swipeBtnFadeIn 5s forwards",
        glow: "glow 1.5s infinite",
        blinker: "blinker 1.5s step-start 0s infinite normal none running",
        dimlight: 'dimlight 5s infinite',
        shimmer: 'shimmer 2s ease-out infinite',
      },
    },
  },
  plugins: [
    nextui(),
    plugin(({ addComponents, theme }: { addComponents: (...args: any[]) => void, theme: (path: string) => string }) => {
      addComponents({
        '.box-reflect': {
          '-webkit-box-reflect': 'below 1px linear-gradient(transparent, #0004)',
        },
        '.shim-green': {
          backgroundColor: theme('colors.green.400'),
          position: 'relative',
          overflow: 'hidden',
        },
        '.shim-green::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          transform: 'translateX(-100%)',
          backgroundImage:
            'linear-gradient(90deg, rgba(233,233,233,1) 0%, rgba(233,233,233,0.9) 50%, rgba(233,233,233,0.8) 100%)',
          animation: 'shimmer 2s ease-out infinite',
        },
        '.shim-amber': {
          backgroundColor: theme('colors.amber.400'),
          position: 'relative',
          overflow: 'hidden',
        },
        '.shim-amber::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          transform: 'translateX(-100%)',
          backgroundImage:
            'linear-gradient(90deg, rgba(233,233,233,1) 0%, rgba(233,233,233,0.9) 50%, rgba(233,233,233,0.8) 100%)',
          animation: 'shimmer 2.2s ease-out infinite',
        },
        '.shim-orange': {
          backgroundColor: theme('colors.orange.500'),
          position: 'relative',
          overflow: 'hidden',
        },
        '.shim-orange::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          transform: 'translateX(-100%)',
          backgroundImage:
            'linear-gradient(90deg, rgba(233,233,233,1) 0%, rgba(233,233,233,0.9) 50%, rgba(233,233,233,0.8) 100%)',
          animation: 'shimmer 2.5s ease-out infinite',
        },
        '.shim-rose': {
          backgroundColor: theme('colors.rose.500'),
          position: 'relative',
          overflow: 'hidden',
        },
        '.shim-rose::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          transform: 'translateX(-100%)',
          backgroundImage:
            'linear-gradient(90deg, rgba(233,233,233,1) 0%, rgba(233,233,233,0.9) 50%, rgba(233,233,233,0.8) 100%)',
          animation: 'shimmer 3s ease-out infinite',
        },
      })
    }),
  ],
};
export default config;
