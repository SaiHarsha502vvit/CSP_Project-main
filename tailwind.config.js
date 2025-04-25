/* Tailwind CSS color palette for the application */
module.exports = {
  content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              primary: {
                  light: "#93C5FD", // Light Blue
                  DEFAULT: "#3B82F6", // Blue
                  dark: "#1E3A8A", // Dark Blue
              },
              secondary: {
                  light: "#FDE68A", // Light Yellow
                  DEFAULT: "#F59E0B", // Yellow
                  dark: "#B45309", // Dark Yellow
              },
              accent: {
                  light: "#FCA5A5", // Light Red
                  DEFAULT: "#EF4444", // Red
                  dark: "#991B1B", // Dark Red
              },
              neutral: {
                  light: "#F3F4F6", // Light Gray
                  DEFAULT: "#9CA3AF", // Gray
                  dark: "#4B5563", // Dark Gray
              },
              background: {
                  light: "#F9FAFB", // Light Background
                  DEFAULT: "#FFFFFF", // White Background
                  dark: "#1F2937", // Dark Background
              },
          },
      },
  },
  plugins: [require("@tailwindcss/forms")],
};