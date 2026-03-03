"use client";
import Link from "next/link";
import { useState, useEffect } from "react"; // ⬅️ Importa useEffect

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // 1. Estado para el scroll
  const [scrolled, setScrolled] = useState(false);

  // 2. Lógica para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      // Si el scroll vertical es mayor a 50px, cambia el estado a true
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Añade el event listener cuando el componente se monta
    window.addEventListener("scroll", handleScroll);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // El array vacío asegura que solo se ejecute al montar/desmontar

  return (
    // 3. Aplica la clase dinámicamente
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar__container">
        <div className="navbar__logo-container">
          <img
            src="/imagenes/logoevento.png"
            alt="Logo ITE"
            className="navbar__logo"
          />
          <span className="navbar__logo-text">
            Eventos <span className="navbar__logo-accent">ITE</span>
          </span>
        </div>

        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        {/* Menú */}
        <ul className={`navbar__menu ${isOpen ? "navbar__menu--open" : ""}`}>
          <li>
            <Link href="/" className="navbar__link active">
              INICIO
            </Link>
          </li>
          <li>
            <Link href="/designs/vistaEventos" className="navbar__link active">
              NOTICIAS
            </Link>
          </li>
          <li>
            <Link
              href="/designs/vistaintramuros"
              className="navbar__link active"
            >
              INTRAMUROS
            </Link>
          </li>

          <li>
            <Link href="/designs/vistaHorarios" className="navbar__link active">
              HORARIOS
            </Link>
          </li>
          <li>
            <Link href="/designs/vistaLogin" className="navbar__link active">
              INICIAR SESION
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
