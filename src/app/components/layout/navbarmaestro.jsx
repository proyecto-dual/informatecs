"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiBook,
  FiClock,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "@/styles/layouts/navbarmaestro.css";

export default function NavbarMaestro({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => {
    if (setOpen) setOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas cerrar sesión?")) {
      closeMenu();
      localStorage.removeItem("maestroData");
      router.push("/designs/vistaLogin");
    }
  };

  const menuItems = [
    { href: "/designs/menumaestros", icon: <FiHome />, label: "Inicio" },
    {
      href: "/designs/menumaestros/vistaMismaterias",
      icon: <FiBook />,
      label: "Mis Materias",
    },
    {
      href: "/designs/menumaestros/vistaMihorario",
      icon: <FiClock />,
      label: "Mi Horario",
    },
    {
      href: "/designs/menumaestros/vistaCalificaciones",
      icon: <FiFileText />,
      label: "Calificaciones",
    },
  ];

  return (
    <>
      {/* Botón Hamburguesa para Móvil */}
      <button
        className="mobile-toggle-btn"
        onClick={() => setOpen && setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`navbarmaestro ${open ? "open" : "closed"}`}>
        {/* Header */}
        <div className="navbarmaestro-header">
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={35} height={35} />
            <div className="logo-text-container">
              <span className="logo-text">Eventos ITE</span>
              <span className="admin-badge">MAESTRO</span>
            </div>
          </div>

          <button
            className="toggle-btn"
            onClick={() => setOpen && setOpen(!open)}
            aria-label="Toggle sidebar"
          >
            <FiMenu />
          </button>
        </div>

        {/* Menú */}
        <ul className="maestros-menu-list">
          {menuItems.map((item) => (
            <li
              key={item.href}
              className={`maestros-menu-item ${
                pathname === item.href ? "active" : ""
              }`}
            >
              <Link
                href={item.href}
                className="maestros-menu-link"
                onClick={closeMenu}
              >
                <span className="maestros-icon">{item.icon}</span>
                <span className="maestros-title">{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Cerrar sesión */}
          <li className="maestros-menu-item logout-item" onClick={handleLogout}>
            <div className="maestros-menu-link">
              <span className="maestros-icon">
                <FiLogOut />
              </span>
              <span className="maestros-title">Cerrar Sesión</span>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}
