import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navigation from "@/components/layout/navigation";
import { SupabaseListener } from "@/components/supabase-listener";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veyoyee",
  description: "A modern web application by taufikhamid2000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen`}
      >
        <ThemeProvider>
          <SupabaseListener>
            <header className="w-full bg-blue-950/95 backdrop-blur-md fixed top-0 z-50 shadow-md">
              <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <Link
                  href="/"
                  className="text-2xl font-bold text-white flex items-center"
                >
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Veyoyee
                  </span>
                </Link>
                <Navigation />
              </div>
            </header>
            {/* Spacer for fixed header */}
            <div className="h-16"></div>
            <main className="w-full">{children}</main>
            <Footer />
          </SupabaseListener>
        </ThemeProvider>
      </body>
    </html>
  );
}
