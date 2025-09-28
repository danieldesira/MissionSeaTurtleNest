/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "src/**/*.{ts,tsx,js,html}"],
  theme: {
    extend: {
      borderRadius: {
        "7xl": "45px",
      },
      fontFamily: {
        "sans-pro": "Source-Sans-Pro",
      },
      maxHeight: {
        "screen-1/4": "25vh",
      },
      backgroundImage: {
        cute: `url("../images/backgrounds/hatchingTurtles.svg")`,
      },
      colors: {
        primary: "#DB2777",
        danger: "#B91C1C",
      },
    },
  },
  plugins: ["postcss"],
};
