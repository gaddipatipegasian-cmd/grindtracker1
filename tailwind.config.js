/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06101f",
        panel: "#0f1c33",
        line: "rgba(148, 163, 184, 0.18)",
      },
      boxShadow: {
        glow: "0 20px 40px rgba(14, 165, 233, 0.12)",
      },
      backgroundImage: {
        "app-grid":
          "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.12) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
