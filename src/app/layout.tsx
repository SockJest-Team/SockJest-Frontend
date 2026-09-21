import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { SincronizadorPerfil } from "@/components/providers/SincronizadorPerfil";
import { NotificacionesPush } from "@/components/providers/NotificacionesPush";
import { FailoverProvider } from "@/components/providers/FailoverProvider";

export const metadata: Metadata = {
  title: "LiveBid Studio",
  description: "Plataforma de subastas en tiempo real",
  verification: {
    google: "JC27INaOYU7u3WWNV4fPdoAtYmbrgON620nNKOHKkng",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-white text-slate-800 antialiased">
        <QueryProvider>
          <FailoverProvider>
            <SincronizadorPerfil />
            <NotificacionesPush />
            <Navbar />
            <main className="min-h-[70vh]">{children}</main>
            <Footer />
          </FailoverProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
