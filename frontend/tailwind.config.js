/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"DotGothic16"', "monospace"],
      },
      keyframes: {
        "float-up": {
          "0%": { opacity: "0", transform: "translate(-50%, 4px) scale(0.85)" },
          "15%": { opacity: "1", transform: "translate(-50%, 0) scale(1.1)" },
          "100%": { opacity: "0", transform: "translate(-50%, -26px) scale(1)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.22)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "float-up": "float-up 0.9s ease-out forwards",
        pop: "pop 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
