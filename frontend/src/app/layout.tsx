import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WireframeBadge from "@/components/WireframeBadge";

export const metadata: Metadata = {
  title: {
    default: "bbbrindes - Brindes corporativos",
    template: "%s | bbbrindes",
  },
  description:
    "Catalogo B2B de brindes corporativos com variacoes, orcamento rapido e area de revendedor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WireframeBadge />
        </CartProvider>
      </body>
    </html>
  );
}
