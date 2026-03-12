"use client";
import "@/styles/alumno/inicio.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiCalendar, FiFileText, FiBarChart2, FiFile } from "react-icons/fi";
import { FaCheck, FaStar } from "react-icons/fa6";
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
      color: "#e8a020",
      highlight: true,
    },
    {
      href: "/designs/menuadmin/vistaInicioAdmin",
      icon: <FiCalendar size={26} />,
      label: "Eventos",
      desc: "Crea, edita y gestiona todos los eventos disponibles",
      color: "#1b396a",
    },
    {
      href: "/designs/menuadmin/AprobarSolicitudes",
      icon: <FaCheck size={26} />,
      label: "Solicitudes",
      desc: "Revisa y aprueba las solicitudes de inscripción pendientes",
      color: "#1b396a",
    },
    {
      href: "/designs/menuadmin/vistaInscripcionesAdmin",
      icon: <FiFileText size={26} />,
      label: "Inscripciones",
      desc: "Listado completo de alumnos inscritos por evento",
      color: "#1b396a",
    },
    {
      href: "/designs/menuadmin/vistaReportes",
      icon: <FiBarChart2 size={26} />,
      label: "Reportes",
      desc: "Estadísticas e informes de participación y actividades",
      color: "#1b396a",
    },
    {
      href: "/designs/menuadmin/vistaConstancias",
      icon: <FiFile size={26} />,
      label: "Constancias",
      desc: "Administra y descarga constancias de participación",
      color: "#1b396a",
    },
    {
      href: "/designs/menuadmin/vistaIntramuros",
      icon: <FaStar size={26} />,
      label: "Intramuros",
      desc: "Gestiona los eventos intramuros y sus participantes",
      color: "#1b396a",
    },
    {
      href: "/designs/menuadmin/publicaciones",
      icon: <Edit size={26} />,
      label: "Publicaciones",
      desc: "Redacta y publica comunicados para los estudiantes",
      color: "#1b396a",
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
        <div
          className={`welcome-hero ${isVisible ? "visible" : ""}`}
          style={{ flexDirection: "column", gap: "2rem" }}
        >
          {/* ── Encabezado ── */}
          <div style={{ width: "100%" }}>
            {/* Badge */}
            <div className="welcome-badge" style={{ marginBottom: "1rem" }}>
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

            <h1
              className="welcome-title-enhanced"
              style={{ marginBottom: "0.5rem" }}
            >
              ¡Bienvenido, {adminName}!
            </h1>
            <p className="welcome-description" style={{ marginBottom: 0 }}>
              Desde aquí puedes gestionar todos los aspectos del sistema.
              Selecciona una sección.
            </p>
          </div>

          {/* ── Grid de tarjetas ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.25rem",
              width: "100%",
            }}
          >
            {adminSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: section.highlight
                      ? "linear-gradient(135deg, #fffbf0 0%, #fff5d6 100%)"
                      : "#fff",
                    border: section.highlight
                      ? "2px solid #e8a020"
                      : "1.5px solid #e8eaf0",
                    borderRadius: "16px",
                    padding: "1.5rem 1.25rem",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = section.highlight
                      ? "0 8px 24px rgba(232,160,32,0.25)"
                      : "0 8px 24px rgba(27,57,106,0.13)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Ícono */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: section.highlight ? "#e8a020" : "#1b396a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {section.icon}
                  </div>

                  {/* Título */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: section.highlight ? "#e8a020" : "#1b396a",
                      }}
                    >
                      {section.label}
                    </span>
                    {section.highlight && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: "700",
                          background: "#e8a020",
                          color: "#fff",
                          borderRadius: "4px",
                          padding: "2px 7px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        DASH
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#555",
                      lineHeight: "1.5",
                      margin: 0,
                    }}
                  >
                    {section.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
