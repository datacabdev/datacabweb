import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataCab – Environmental Data Simplification",
  description:
    "The Media Awareness and Justice Initiative through the DATACAB portal collects, analyzes and simplifies real time environmental data across Nigeria.",
  icons: {
    icon: "/datacablogo.svg",
    shortcut: "/datacablogo.svg",
    apple: "/datacablogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
