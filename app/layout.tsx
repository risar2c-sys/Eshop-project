import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthProvider from "@/components/providers/AuthProvider";

const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-fraunces", weight: ["400", "500", "600"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "Čaj Koření Káva",
  description: "Prémiové čaje, sušené byliny, pražená káva a koření z ověřených zdrojů.",
  openGraph: { title: "Čaj Koření Káva", description: "Prémiové čaje, byliny, káva a koření.", type: "website", locale: "cs_CZ" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body bg-sand text-bark antialiased`}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
