import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Tema neutro de wireframe (legado). Vai saindo conforme as paginas
        // sao refeitas na identidade da Joy.
        wf: {
          bg: "#f5f5f4",
          surface: "#ffffff",
          line: "#d6d3d1",
          muted: "#a8a29e",
          text: "#44403c",
          ink: "#1c1917",
          accent: "#3f6212",
        },
        // Design system BB Brindes (Joy). Espelha os tokens :root de joy.css
        // para que utilitarios Tailwind (bg-joy-deep, text-joy-lime...) usem a
        // paleta nova. joy.css segue sendo a fonte da verdade do visual.
        joy: {
          deep: "#004431",
          deep2: "#00301f",
          deep3: "#0b6a47",
          green: "#51ad46",
          sage: "#b4c994",
          cream: "#ebecdb",
          paper: "#f6f6ef",
          lime: "#abe375",
          orange: "#f99b37",
          orange2: "#ec7d16",
          ink: "#0f2a20",
          muted: "#5a6b62",
          line: "#e2e4d6",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        joy: "20px",
        "joy-sm": "14px",
        pill: "999px",
      },
      boxShadow: {
        joy1: "0 1px 2px rgba(0,40,25,.06),0 4px 14px rgba(0,40,25,.06)",
        joy2: "0 10px 30px rgba(0,40,25,.12),0 2px 6px rgba(0,40,25,.06)",
        cta: "0 8px 22px rgba(236,125,22,.35)",
      },
      maxWidth: {
        wrap: "1248px",
      },
    },
  },
  plugins: [],
};

export default config;
