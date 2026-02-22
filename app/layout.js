import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ModalProvider } from "@/context/ModalContext";
import { Google_Sans_Flex } from 'next/font/google'
import SmoothScrollProvider, { LenisProvider } from "./lenis-providers";
import { Suspense } from "react";

const gsf = Google_Sans_Flex({
  weight: '400',
  subsets: ['latin'],
})


export const metadata = {
  title: "Bertrand Kolly | Artiste peintre",
  description: "Site web d'exposition des oeuvres de Bertrand Kolly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={` ${gsf.className} antialiased bg-stone-950`}
      >
        <div className="z-[10] bg-red-300 relative">
          <Header />
          <Suspense fallback={null}>
            <ModalProvider>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
            </ModalProvider>
          </Suspense>
        </div>
        <Footer />
      </body>
    </html>
  );
}
