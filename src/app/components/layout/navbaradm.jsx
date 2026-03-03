"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiFile,
  FiX,
} from "react-icons/fi";
import { FaCheck, FaStar } from "react-icons/fa6";
import { Edit } from "lucide-react";
import "@/styles/layouts/navbaradm.css";

const menuItems = [
  { href: "/designs/menuadmin", icon: <FiHome />, label: "Inicio" },
  {
    href: "/designs/menuadmin/vistaInicioAdmin",
    icon: <FiCalendar />,
    label: "Eventos",
  },
  {
    href: "/designs/menuadmin/AprobarSolicitudes",
    icon: <FaCheck />,
    label: "Solicitudes",
  },
  {
    href: "/designs/menuadmin/vistaInscripcionesAdmin",
    icon: <FiFileText />,
    label: "Inscripciones",
  },
  {
    href: "/designs/menuadmin/vistaReportes",
    icon: <FiBarChart2 />,
    label: "Reportes",
  },
  {
    href: "/designs/menuadmin/vistaConstancias",
    icon: <FiFile />,
    label: "Constancias",
  },
  {
    href: "/designs/menuadmin/vistaIntramuros",
    icon: <FaStar />,
    label: "Intramuros",
  },
  {
    href: "/designs/menuadmin/publicaciones",
    icon: <Edit />,
    label: "Publicaciones",
  },
];

export default function AdminSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Botón Móvil (Hamburguesa/Cerrar) */}
      <button className="toggle-btn-mobile" onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sliderbaradm ${open ? "open" : "closed"}`}>
        <div className="sliderbaradm-header">
          <div className="logo-container">
            <Image src="/imagenes/ite.svg" alt="Logo" width={30} height={30} />
            <span className="logo-text">Eventos ITE</span>
          </div>
          <button className="desktop-toggle" onClick={() => setOpen(!open)}>
            <FiMenu />
          </button>
        </div>

        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.href}
              className={`menu-item ${pathname === item.href ? "active" : ""}`}
            >
              <Link href={item.href} className="menu-link">
                <span className="icon">{item.icon}</span>
                <span className="etiqueta-flotante">{item.label}</span>
              </Link>
            </li>
          ))}

          <li
            className="menu-item logout"
            onClick={() => router.push("/designs/vistaLogin")}
          >
            <div className="menu-link">
              <span className="icon">
                <FiLogOut />
              </span>
              <span className="etiqueta-flotante">Cerrar Sesión</span>
            </div>
          </li>
        </ul>
      </aside>
    </>
  );
}
