import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./design-system.css";
import { CartProvider } from "@/lib/cart";
import { CartUIProvider } from "@/lib/cart-ui";
import CartDrawer from "@/components/CartDrawer";

// Fonte da identidade da Joy. Expoe --font-poppins (usada no tailwind.config)
// e aplica Poppins no body (a classe vence o seletor de elemento do design-system.css).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BB Brindes - Brindes corporativos personalizados",
    template: "%s | BB Brindes",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: "BB Brindes - Brindes corporativos personalizados",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "BB Brindes - Brindes corporativos personalizados",
    description: SITE_DESCRIPTION,
  },
};

// Dados estruturados da organizacao (site inteiro), para o Google entender a marca.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${poppins.className} flex min-h-screen flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <CartProvider>
          <CartUIProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartUIProvider>
        </CartProvider>
      </body>
    </html>
  );
}
