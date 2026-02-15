import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { inter } from "@/app/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "myApp — Plataforma Inteligente",
  description:
    "Gestiona productos, genera contenido con IA y administra tu negocio desde una sola plataforma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
