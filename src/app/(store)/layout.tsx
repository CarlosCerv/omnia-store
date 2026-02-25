import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./../globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "OMNIA | Nordic Gallery",
  description: "High-end minimalist essentials for the modern silhouette.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable} antialiased selection:bg-black selection:text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
