export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      colors: {
        main: "#916fae",
        tercer: "#F1F1F1",
        cuarto: "#41326D",
        secondary: {
            100: "#1E1F25",
            900: "#131517",
          },
          main_2: {
              100: "#fff",
              150: "#F9FAFB",
              200: "#BDABD2",
              900: "#131517",
          },
      },
    },
  },
  plugins: []
}