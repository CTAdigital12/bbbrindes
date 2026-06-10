import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Tema neutro de wireframe. Identidade visual final entra depois.
        wf: {
          bg: "#f5f5f4",
          surface: "#ffffff",
          line: "#d6d3d1",
          muted: "#a8a29e",
          text: "#44403c",
          ink: "#1c1917",
          accent: "#3f6212",
        },
      },
    },
  },
  plugins: [],
};

export default config;
