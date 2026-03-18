"use client";
import "@/styles/admin/welcome.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiCalendar, FiFileText, FiBarChart2, FiFile } from "react-icons/fi";
import { FaCheck, FaStar, FaUserShield } from "react-icons/fa6";
import { Edit, LayoutDashboard } from "lucide-react";

export default function WelcomeAdminPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [adminName, setAdminName] = useState("Administrador");

  const adminSections = [
    {
      href: "/designs/menuadmin/GraficasPta",
      icon: <LayoutDashboard size={26} />,
      label: "Gráficas PTA",
      desc: "Estadísticas de inscripciones, géneros y semestres en tiempo real",
      highlight: true,
    },
    {
      href: "/designs/menuadmin/vistaInicioAdmin",
      icon: <FiCalendar size={26} />,
      label: "Eventos",
      desc: "Crea, edita y gestiona todos los eventos disponibles",
    },
    {
      href: "/designs/menuadmin/AprobarSolicitudes",
      icon: <FaCheck size={26} />,
      label: "Solicitudes",
      desc: "Revisa y aprueba las solicitudes de inscripción pendientes",
    },
    {
      href: "/designs/menuadmin/vistaInscripcionesAdmin",
      icon: <FiFileText size={26} />,
      label: "Inscripciones",
      desc: "Listado completo de alumnos inscritos por evento",
    },
    {
      href: "/designs/menuadmin/vistaReportes",
      icon: <FiBarChart2 size={26} />,
      label: "Reportes",
      desc: "Estadísticas e informes de participación y actividades",
    },
    {
      href: "/designs/menuadmin/vistaConstancias",
      icon: <FiFile size={26} />,
      label: "Constancias",
      desc: "Administra y descarga constancias de participación",
    },
    {
      href: "/designs/menuadmin/vistaIntramuros",
      icon: <FaStar size={26} />,
      label: "Intramuros",
      desc: "Gestiona los eventos intramuros y sus participantes",
    },
    {
      href: "/designs/menuadmin/publicaciones",
      icon: <Edit size={26} />,
      label: "Publicaciones",
      desc: "Redacta y publica comunicados para los estudiantes",
    },
    {
      href: "/designs/menuadmin/solicitudesSubAdmin",
      icon: <FaUserShield size={26} />,
      label: "Accesos Sub Admin",
      desc: "Aprueba o rechaza solicitudes de acceso del sub administrador",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const stored = localStorage.getItem("adminName");
    if (stored) setAdminName(stored);
  }, []);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main welcome-main-enhanced">
        <div className={`welcome-hero ${isVisible ? "visible" : ""}`}>
          {/* ── Encabezado ── */}
          <div className="welcome-header">
            <div className="welcome-badge">
              <svg
                className="icon-trophy"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                     11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824
                     10.29 9 11.622 5.176-1.332 9-6.03 9-11.622
                     0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Panel de Administración — Eventos ITE</span>
            </div>

            <h1 className="welcome-title-enhanced">
              ¡Bienvenido, {adminName}!
            </h1>
            <p className="welcome-description">
              Desde aquí puedes gestionar todos los aspectos del sistema.
              Selecciona una sección.
            </p>
          </div>

          {/* ── Grid de tarjetas ── */}
          <div className="admin-grid">
            {adminSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="admin-card-link"
              >
                <div
                  className={`admin-card${section.highlight ? " admin-card--highlight" : ""}`}
                >
                  {/* Ícono */}
                  <div className="admin-card__icon">{section.icon}</div>

                  {/* Cuerpo (título + descripción) */}
                  <div className="admin-card__body">
                    <div className="admin-card__title-row">
                      <span className="admin-card__label">{section.label}</span>
                      {section.highlight && (
                        <span className="admin-card__badge">DASH</span>
                      )}
                    </div>

                    <p className="admin-card__desc">{section.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
