import type { Metadata } from "next";
import NavBar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import Providers from "./providers";
import AuthSyncWrapper from "@/components/layout/AuthSyncWrapper";

export const metadata: Metadata = {
  title: "Live",
  description: "App de subastas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {/* 1. El wrapper verifica el token con el backend al cargar la web */}
          <AuthSyncWrapper>
            {/* 2. El Navbar lee Zustand y cambia los botones según si está logueado o no */}
            <NavBar />

            {/* 3. Aquí se inyecta tu HomeView, SubastasView, etc. */}
            <main>{children}</main>

            {/* 4. Footer global */}
            <Footer />
          </AuthSyncWrapper>
        </Providers>
      </body>
    </html>
  );
}
