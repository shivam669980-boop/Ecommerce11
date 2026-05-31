import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/layout/theme-provider";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zoko Luxury Mall | Premium E-Commerce Hub",
  description: "Experience the utility of Amazon and the elegance of Apple. Shop the hottest tech, streetwear, furniture, and kitchen collections with priority nationwide logistics.",
  openGraph: {
    title: "Zoko Luxury Mall | Premium E-Commerce Hub",
    description: "Experience the utility of Amazon and the elegance of Apple. Shop the hottest tech, streetwear, furniture, and kitchen collections with priority nationwide logistics.",
    type: "website",
    locale: "en_US",
    url: "https://zoko-luxury-mall.vercel.app",
    siteName: "Zoko Luxury Mall"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
