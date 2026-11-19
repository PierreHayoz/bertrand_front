import "./globals.css";
import { Suspense } from "react";
import { Google_Sans_Flex } from "next/font/google";
import localFont from "next/font/local";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ModalProvider } from "@/context/ModalContext";
import SmoothScrollProvider from "./lenis-providers";
import { Providers } from "./providers";
import Motion from "./components/Motion";
import Cursor from "./components/Cursor";
import { BrushDefs } from "./components/Brush";
import { getContact } from "./lib/content";

const body = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

// Gambarino (Théo Guillard / Indian Type Foundry, ITF Free Font License : auto-hébergement autorisé)
const display = localFont({
  src: "./fonts/Gambarino-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const metadata = {
  metadataBase: new URL("https://bertrandkolly.ch"),
  title: {
    default: "Bertrand Kolly | Artiste peintre",
    template: "%s | Bertrand Kolly",
  },
  description:
    "Bertrand Kolly, artiste peintre à Lovens (Fribourg) : œuvres à l'acrylique et au pastel, expositions et parcours.",
  openGraph: {
    siteName: "Bertrand Kolly",
    locale: "fr_CH",
    type: "website",
    images: [{ url: "/images/autoportrait.jpg", width: 1440, height: 1800, alt: "Autoportrait de Bertrand Kolly" }],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

/*
 * Avant le premier affichage : thème mémorisé (pas de flash) et marqueur JS.
 * Filet de sécurité : si les animations ne se mettent pas en place, on affiche tout.
 */
const bootScript = `(function(){var d=document.documentElement;d.dataset.js="";try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")d.dataset.theme=t}catch(e){}setTimeout(function(){if(!d.dataset.motion)d.dataset.motion="off"},4000)})()`;

export default async function RootLayout({ children }) {
  const contact = await getContact();

  return (
    <html
      lang="fr-CH"
      data-theme="light"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <BrushDefs />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200 focus:bg-ink focus:text-bg focus:px-4 focus:py-2"
        >
          Aller au contenu
        </a>
        <Header contact={contact} />
        <Providers>
          <div id="contenu" className="relative z-10 min-h-screen bg-bg">
            <Suspense fallback={null}>
              <ModalProvider>
                <SmoothScrollProvider>
                  <Motion />
                  {children}
                </SmoothScrollProvider>
              </ModalProvider>
            </Suspense>
          </div>
          <Footer contact={contact} />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
