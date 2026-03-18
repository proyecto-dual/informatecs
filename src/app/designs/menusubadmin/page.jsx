"use client";
import "@/styles/alumno/inicio.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiCalendar, FiFileText, FiBarChart2, FiFile } from "react-icons/fi";
import { FaCheck, FaStar, FaLock } from "react-icons/fa6";
import { Edit, LayoutDashboard } from "lucide-react";

// Secciones que requieren permiso del admin
const REQUIEREN_PERMISO = ["Gráficas PTA", "Eventos", "Inscripciones", "Constancias"];

export default function WelcomeSubAdminPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [subAdminName, setSubAdminName] = useState("Sub Administrador");
  const [permisosActivos, setPermisosActivos] = useState([]);
  const [solicitando, setSolicitando] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const subAdminSections = [
    {
      href: "/designs/menusubadmin/GraficasPta",
      icon: <LayoutDashboard size={26} />,
      label: "Gráficas PTA",
      desc: "Estadísticas de inscripciones, géneros y semestres en tiempo real",
      color: "#e8a020",
      highlight: true,
    },
    {
      href: "/designs/menusubadmin/vistaInicioAdmin",
      icon: <FiCalendar size={26} />,
      label: "Eventos",
      desc: "Crea, edita y gestiona todos los eventos disponibles",
      color: "#1b396a",
    },
    {
      href: "/designs/menusubadmin/AprobarSolicitudes",
      icon: <FaCheck size={26} />,
      label: "Solicitudes",
      desc: "Revisa y aprueba las solicitudes de inscripción pendientes",
      color: "#1b396a",
    },
    {
      href: "/designs/menusubadmin/vistaInscripcionesAdmin",
      icon: <FiFileText size={26} />,
      label: "Inscripciones",
      desc: "Listado completo de alumnos inscritos por evento",
      color: "#1b396a",
    },
    {
      href: "/designs/menusubadmin/vistaReportes",
      icon: <FiBarChart2 size={26} />,
      label: "Reportes",
      desc: "Estadísticas e informes de participación y actividades",
      color: "#1b396a",
    },
    {
      href: "/designs/menusubadmin/vistaConstancias",
      icon: <FiFile size={26} />,
      label: "Constancias",
      desc: "Administra y descarga constancias de participación",
      color: "#1b396a",
    },
    {
      href: "/designs/menusubadmin/vistaIntramuros",
      icon: <FaStar size={26} />,
      label: "Intramuros",
      desc: "Gestiona los eventos intramuros y sus participantes",
      color: "#1b396a",
    },
    {
      href: "/designs/menusubadmin/publicaciones",
      icon: <Edit size={26} />,
      label: "Publicaciones",
      desc: "Redacta y publica comunicados para los estudiantes",
      color: "#1b396a",
    },
  ];

 
useEffect(() => {
  setIsVisible(true);
  const stored = localStorage.getItem("subAdminName");
  if (stored) setSubAdminName(stored);

  // Cargar permisos aprobados desde BD
  const cargarPermisos = async () => {
    const subUser = localStorage.getItem("subAdminName");
    if (!subUser) return;
    try {
      const res = await fetch(`/api/subadmin/mis-permisos?user=${subUser}`);
      const data = await res.json();
      if (data.permisos) {
        sessionStorage.setItem("subAdminPermisos", JSON.stringify(data.permisos));
        setPermisosActivos(data.permisos);
      }
    } catch {}
  };
  cargarPermisos();
}, []);
  const tienePermiso = (label) => {
    if (!REQUIEREN_PERMISO.includes(label)) return true;
    return permisosActivos.includes(label);
  };

  const handleSolicitarAcceso = async (label) => {
    setSolicitando(label);
    setMensaje(null);
    try {
      const res = await fetch("/api/subadmin/solicitar-acceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seccion: label, subAdminUser: subAdminName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje({ type: "ok", text: `Solicitud enviada para "${label}". Espera que el administrador la apruebe.` });
      } else {
        setMensaje({ type: "error", text: data.message || "Error al enviar solicitud." });
      }
    } catch {
      setMensaje({ type: "error", text: "Error al conectar con el servidor." });
    } finally {
      setSolicitando(null);
    }
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-main welcome-main-enhanced">
        <div className={`welcome-hero ${isVisible ? "visible" : ""}`} style={{ flexDirection: "column", gap: "2rem" }}>

          {/* Encabezado */}
          <div style={{ width: "100%" }}>
            <div className="welcome-badge" style={{ marginBottom: "1rem" }}>
              <svg className="icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                     11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824
                     10.29 9 11.622 5.176-1.332 9-6.03 9-11.622
                     0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Panel de Sub Administración — Eventos ITE</span>
            </div>
            <h1 className="welcome-title-enhanced" style={{ marginBottom: "0.5rem" }}>
              ¡Bienvenido, {subAdminName}!
            </h1>
            <p className="welcome-description" style={{ marginBottom: 0 }}>
              Puedes consultar todas las secciones. Para realizar cambios, solicita acceso al administrador.
            </p>
          </div>

          {/* Mensaje de feedback */}
          {mensaje && (
            <div style={{
              background: mensaje.type === "ok" ? "#eafaf1" : "#fdecea",
              border: `1px solid ${mensaje.type === "ok" ? "#27ae60" : "#e74c3c"}`,
              color: mensaje.type === "ok" ? "#27ae60" : "#c0392b",
              borderRadius: "10px", padding: "0.75rem 1rem", width: "100%",
              fontSize: "0.88rem",
            }}>
              {mensaje.type === "ok" ? "✅" : "⚠️"} {mensaje.text}
            </div>
          )}

          {/* Grid de tarjetas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", width: "100%" }}>
            {subAdminSections.map((section) => {
              const necesitaPermiso = REQUIEREN_PERMISO.includes(section.label);
              const accesoConcedido = tienePermiso(section.label);
              const bloqueada = necesitaPermiso && !accesoConcedido;

              return (
                <div key={section.href} style={{ position: "relative" }}>
                  {/* Tarjeta — si está bloqueada no navega */}
                  {accesoConcedido ? (
                    <Link href={section.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                      <TarjetaContenido section={section} bloqueada={false} />
                    </Link>
                  ) : (
                    <TarjetaContenido section={section} bloqueada={bloqueada} />
                  )}

                  {/* Overlay de candado */}
                  {bloqueada && (
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "16px",
                      background: "rgba(255,255,255,0.82)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "0.5rem",
                      backdropFilter: "blur(2px)",
                    }}>
                      <FaLock size={22} color="#1b396a" />
                      <button
                        onClick={() => handleSolicitarAcceso(section.label)}
                        disabled={solicitando === section.label}
                        style={{
                          background: "#1b396a", color: "#fff", border: "none",
                          borderRadius: "8px", padding: "6px 14px",
                          fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                          opacity: solicitando === section.label ? 0.7 : 1,
                        }}
                      >
                        {solicitando === section.label ? "Enviando..." : "Solicitar acceso"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function TarjetaContenido({ section, bloqueada }) {
  return (
    <div style={{
      background: section.highlight ? "linear-gradient(135deg, #fffbf0 0%, #fff5d6 100%)" : "#fff",
      border: section.highlight ? "2px solid #e8a020" : "1.5px solid #e8eaf0",
      borderRadius: "16px", padding: "1.5rem 1.25rem",
      cursor: bloqueada ? "default" : "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "100%", display: "flex", flexDirection: "column", gap: "0.75rem",
      opacity: bloqueada ? 0.6 : 1,
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "12px",
        background: section.highlight ? "#e8a020" : "#1b396a",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", flexShrink: 0,
      }}>
        {section.icon}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ fontWeight: "700", fontSize: "1rem", color: section.highlight ? "#e8a020" : "#1b396a" }}>
          {section.label}
        </span>
        {section.highlight && (
          <span style={{ fontSize: "0.6rem", fontWeight: "700", background: "#e8a020", color: "#fff", borderRadius: "4px", padding: "2px 7px" }}>
            DASH
          </span>
        )}
      </div>
      <p style={{ fontSize: "0.82rem", color: "#555", lineHeight: "1.5", margin: 0 }}>
        {section.desc}
      </p>
    </div>
  );
}