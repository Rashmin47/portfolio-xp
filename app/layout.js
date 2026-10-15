import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/seo";
import WorldCanvas from "@/components/world/WorldCanvas";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rashmin Sharma | Software Developer, Nepal",
    template: "%s | Rashmin Sharma",
  },
  description:
    "Portfolio of Rashmin Sharma, a software developer in Nepal: projects, experiments, roadmap and notes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      {/*
       * bg-night: fallback dark background when canvas is not rendered.
       * pointer-events: none on body so the 3D canvas receives events through
       * the gaps between panels. Each interactive element sets pointer-events:auto.
       */}
      <body
        className="antialiased leading-8 bg-night text-paper"
        style={{ pointerEvents: "none" }}
      >
        {/* Persistent 3D world — fixed, z-index 0, aria-hidden */}
        <WorldCanvas />

        {/* Page content — sits above the world */}
        {children}
      </body>
    </html>
  );
}
