import "./globals.css";
import type { Metadata } from "next"; 
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer"; 

import ClientLayout from "@/app/client-layout";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <ClientLayout>{children}</ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
