"use client";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { isLoggedIn, user, logoutStore } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header id="navbar" className={scrolled ? "scrolled" : ""}>
      <nav className="nav-left">
        <a href="#home" className="nav-link">
          Inicio
        </a>
        <a href="#subastas" className="nav-link">
          Subastas
        </a>
      </nav>

      <div className="logo">LIVEBID</div>

      <div className="nav-right">
        {/* AQUÍ USA EL ESTADO GLOBAL */}
        {isLoggedIn ? (
          <>
            <i className="fa-regular fa-bell"></i>
            <div className="user-icon">{user?.name.charAt(0) || "U"}</div>
            <button onClick={logoutStore} className="text-red-500 ml-4">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="nav-link">
              Iniciar Sesión
            </a>
            <a href="/registro" className="nav-link">
              Registrarse
            </a>
          </>
        )}
      </div>
    </header>
  );
}
