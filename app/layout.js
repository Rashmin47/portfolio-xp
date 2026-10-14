import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

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
  title: "Rashmin's Portfolio",
  description: "Full Stack Developer",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <body
        className={`antialiased leading-8 overflow-x-hidden dark:bg-darkTheme dark:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
