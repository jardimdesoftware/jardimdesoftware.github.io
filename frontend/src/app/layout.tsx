import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jardim de Software — IFPE Campus Belo Jardim",
  description:
    "Jardim de Software do IFPE - Campus Belo Jardim: ensino, extensão, pesquisa e inovação em desenvolvimento de soluções digitais.",
  openGraph: {
    title: "Jardim de Software — IFPE Campus Belo Jardim",
    description:
      "Desenvolvimento de soluções de software com foco em ensino, extensão, pesquisa e inovação.",
    type: "website",
    images: ["/logob.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1E88E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </QueryProvider>
      </body>
    </html>
  );
}
