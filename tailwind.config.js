/** @type {import('tailwindcss').Config} */
export const content = ["src/index.base.html", "src/**/*.{ts,js,html}"];
export const theme = {
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
};
export const plugins = ["postcss"];
