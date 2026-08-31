"use client";
import { useEffect } from "react";

export default function HomeView() {
  useEffect(() => {}, []);

  return (
    <>
      <section id="home" className="hero">
        <h1 className="fade-in">Bienvenido a LiveBid</h1>
        <h2 className="fade-in" style={{ transitionDelay: "0.2s" }}>
          Subastas en tiempo real
        </h2>
        <button className="btn-outline fade-in">Ver Subastas</button>
      </section>

      <section id="productos" className="novedades">
        <h2 className="section-title fade-in">Subastas Activas</h2>
      </section>
    </>
  );
}
