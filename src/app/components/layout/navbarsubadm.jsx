"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome, FiCalendar, FiFileText, FiBarChart2,
  FiLogOut, FiMenu, FiFile, FiX, FiTrendingUp,
} from "react-icons/fi";
import { FaCheck, FaStar } from "react-icons/fa6";
import { Edit } from "lucide-react";
import "@/styles/layouts/navbaradm.css";

const menuItems = [
  { href: "/designs/menusubadmin", icon: <FiHome />, label: "Inicio" },
  { href: "/designs/menusubadmin/vistaInicioAdmin", icon: <FiCalendar />, label: "Eventos" },
  { href: "/designs/menusubadmin/AprobarSolicitudes", icon: <FaCheck />, label: "Solicitudes" },
  { href: "/designs/menusubadmin/vistaInscripcionesAdmin", icon: <FiFileText />, label: "Inscripciones" },
  { href: "/designs/menusubadmin/vistaReportes", icon: <FiBarChart2 />, label: "Reportes" },
  { href: "/designs/menusubadmin/vistaConstancias", icon: <FiFile />, label: "Constancias" },
  { href: "/designs/menusubadmin/vistaIntramuros", icon: <FaStar />, label: "Intramuros" },
  { href: "/designs/menusubadmin/GraficasPta", icon: <FiTrendingUp />, label: "Gráficas PTA" },
  { href: "/designs/menusubadmin/publicaciones", icon: <Edit />, label: "Publicaciones" },
];

export default function SubAdminSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => setOpen(false);

  return (
    <>
      <button className="toggle-btn-mobile" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sliderbaradm ${open ? "open" : "closed"}`}>
        <div className="sliderbaradm-header">
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={30} height={30} />
            <span className="logo-text">Eventos ITE</span>
          </div>
          <button className="desktop-toggle" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
            <FiMenu />
          </button>
        </div>

        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.href} className={`menu-item ${pathname === item.href ? "active" : ""}`}>
              <Link href={item.href} className="menu-link" onClick={closeMenu}>
                <span className="icon">{item.icon}</span>
                <span className="etiqueta-flotante">{item.label}</span>
              </Link>
            </li>
          ))}

          <li className="menu-item logout" onClick={() => { closeMenu(); router.push("/designs/vistaLogin"); }}>
            <div className="menu-link">
              <span className="icon"><FiLogOut /></span>
              <span className="etiqueta-flotante">Cerrar Sesión</span>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}