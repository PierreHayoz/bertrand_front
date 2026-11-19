import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ModalProvider } from "@/context/ModalContext";
import { Google_Sans_Flex } from 'next/font/google'
import SmoothScrollProvider, { LenisProvider } from "./lenis-providers";
import { Suspense } from "react";
import { Providers } from "./providers";

const gsf = Google_Sans_Flex({
  weight: '400',
  subsets: ['latin'],
})


export const metadata = {
  metadataBase: new URL("https://bertrandkolly.ch"),
  title: {
    default: "Bertrand Kolly | Artiste peintre",
    template: "%s | Bertrand Kolly",
  },
  description: "Découvrez les œuvres de Bertrand Kolly, artiste peintre.",
  openGraph: {
    siteName: "Bertrand Kolly",
    locale: "fr_CH",
    type: "website",
    images: [{ url: "/images/autoportrait.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={` ${gsf.className} antialiased bg-stone-950`}
      >
        <Header />

        <Providers>
          <div className="z-10 relative min-h-screen bg-stone-950">
            <Suspense fallback={null}>
              <ModalProvider>
                <SmoothScrollProvider>{children}</SmoothScrollProvider>
              </ModalProvider>
            </Suspense>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
