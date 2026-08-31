"use client";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer id="contacto">
      <div className="footer-content">
        {/* Columna 1: Información */}
        <div className="footer-col fade-in">
          <h3>
            Más información
            <br />
            sobre LiveBid
          </h3>
          <div style={{ display: "flex", gap: "50px" }}>
            <ul>
              <li>
                <a href="#">Subastas</a>
              </li>
              <li>
                <a href="#">Vender</a>
              </li>
              <li>
                <a href="#">Acerca de</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Contacto</a>
              </li>
            </ul>
            <ul style={{ marginTop: "auto" }}>
              <li>
                <a href="#" style={{ textDecoration: "underline" }}>
                  Visita nuestras tiendas
                </a>
              </li>
              <li>Servicio al cliente: 123-456-7890</li>
            </ul>
          </div>
        </div>

        {/* Columna 2: Ayuda y Newsletter */}
        <div
          className="footer-col small-title fade-in"
          style={{ transitionDelay: "0.2s" }}
        >
          <h3>Ayuda</h3>
          <ul>
            <li>
              <a href="#">Centro de ayuda</a>
            </li>
            <li>
              <a href="#">Envíos y devoluciones</a>
            </li>
            <li>
              <a href="#">Políticas de la tienda</a>
            </li>
            <li>
              <a href="#">Métodos de pago</a>
            </li>
          </ul>

          <div className="newsletter">
            <label>Ingresa tu email aquí *</label>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input type="email" required placeholder="tu@correo.com" />
              <button type="submit">Unirse</button>
            </form>
            <div className="checkbox-group">
              <input type="checkbox" id="boletin" />
              <label htmlFor="boletin" style={{ margin: 0 }}>
                Sí, suscríbeme a tu boletín.
              </label>
            </div>
          </div>
        </div>

        {/* Columna 3: Redes Sociales */}
        <div
          className="footer-col small-title fade-in"
          style={{ transitionDelay: "0.4s" }}
        >
          <h3>Síguenos</h3>
          <ul>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Twitter / X</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Fondo del Footer */}
      <div className="footer-bottom fade-in">
        <p>©2026 Creado por LiveBid. Todos los derechos reservados.</p>
        {/* Usamos onClick en lugar de un eventListener del DOM */}
        <p
          className="subir"
          onClick={scrollToTop}
          style={{ cursor: "pointer" }}
        >
          <i className="fa-solid fa-arrow-up"></i> Subir arriba
        </p>
      </div>
    </footer>
  );
}
