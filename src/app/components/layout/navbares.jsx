"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiClipboard,
  FiActivity,
  FiAward,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import "@/styles/layouts/navbares.css";

const menuItems = [
  { href: "/designs/menuestu/vistaInicio", icon: <FiHome />, label: "Inicio" },
  { href: "/designs/menuestu", icon: <FiUser />, label: "Perfil" },
  {
    href: "/designs/menuestu/vistaCategorias",
    icon: <FiClipboard />,
    label: "Actividades",
  },
  {
    href: "/designs/menuestu/misActividades",
    icon: <FiActivity />,
    label: "Mis Actividades",
  },
  {
    href: "/designs/menuestu/misConstancias",
    icon: <FiAward />,
    label: "Constancias",
  },
];

export default function SidebarEstudiante({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Botón Móvil */}
      <button className="toggle-btn-mobile" onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar-estu ${open ? "open" : "closed"}`}>
        <div className="sidebar-estu-header">
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
