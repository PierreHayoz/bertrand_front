import "./globals.css";
import { Suspense } from "react";
import { Google_Sans_Flex, Instrument_Serif } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ModalProvider } from "@/context/ModalContext";
import SmoothScrollProvider from "./lenis-providers";
import { Providers } from "./providers";
import { getFooter } from "./lib/footer";

const body = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
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
  },
};

// Applique le thème mémorisé avant le premier affichage (évite un flash de couleur).
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }) {
  const contact = await getFooter();

  return (
    <html lang="fr-CH" data-theme="light" suppressHydrationWarning className={`${body.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header contact={contact} />
        <Providers>
          <div className="relative z-10 min-h-screen bg-bg">
            <Suspense fallback={null}>
              <ModalProvider>
                <SmoothScrollProvider>{children}</SmoothScrollProvider>
              </ModalProvider>
            </Suspense>
          </div>
          <Footer contact={contact} />
        </Providers>
      </body>
    </html>
  );
}
