"use client";
import "@/styles/subadmin/welcome.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiCalendar, FiFileText, FiBarChart2, FiFile } from "react-icons/fi";
import { FaCheck, FaStar, FaLock } from "react-icons/fa6";
import { Edit, LayoutDashboard } from "lucide-react";

// Secciones que requieren permiso del admin
const REQUIEREN_PERMISO = [
  "Gráficas PTA",
  "Eventos",
  "Inscripciones",
  "Constancias",
];

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
      highlight: true,
    },
    {
      href: "/designs/menusubadmin/vistaInicioAdmin",
      icon: <FiCalendar size={26} />,
      label: "Eventos",
      desc: "Crea, edita y gestiona todos los eventos disponibles",
    },
    {
      href: "/designs/menusubadmin/AprobarSolicitudes",
      icon: <FaCheck size={26} />,
      label: "Solicitudes",
      desc: "Revisa y aprueba las solicitudes de inscripción pendientes",
    },
    {
      href: "/designs/menusubadmin/vistaInscripcionesAdmin",
      icon: <FiFileText size={26} />,
      label: "Inscripciones",
      desc: "Listado completo de alumnos inscritos por evento",
    },
    {
      href: "/designs/menusubadmin/vistaReportes",
      icon: <FiBarChart2 size={26} />,
      label: "Reportes",
      desc: "Estadísticas e informes de participación y actividades",
    },
    {
      href: "/designs/menusubadmin/vistaConstancias",
      icon: <FiFile size={26} />,
      label: "Constancias",
      desc: "Administra y descarga constancias de participación",
    },
    {
      href: "/designs/menusubadmin/vistaIntramuros",
      icon: <FaStar size={26} />,
      label: "Intramuros",
      desc: "Gestiona los eventos intramuros y sus participantes",
    },
    {
      href: "/designs/menusubadmin/publicaciones",
      icon: <Edit size={26} />,
      label: "Publicaciones",
      desc: "Redacta y publica comunicados para los estudiantes",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const stored = localStorage.getItem("subAdminName");
    if (stored) setSubAdminName(stored);

    const cargarPermisos = async () => {
      const subUser = localStorage.getItem("subAdminName");
      if (!subUser) return;
      try {
        const res = await fetch(`/api/subadmin/mis-permisos?user=${subUser}`);
        const data = await res.json();
        if (data.permisos) {
          sessionStorage.setItem(
            "subAdminPermisos",
            JSON.stringify(data.permisos),
          );
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
        setMensaje({
          type: "ok",
          text: `Solicitud enviada para "${label}". Espera que el administrador la apruebe.`,
        });
      } else {
        setMensaje({
          type: "error",
          text: data.message || "Error al enviar solicitud.",
        });
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
              <span>Panel de Sub Administración — Eventos ITE</span>
            </div>

            <h1 className="welcome-title-enhanced">
              ¡Bienvenido, {subAdminName}!
            </h1>
            <p className="welcome-description">
              Puedes consultar todas las secciones. Para realizar cambios,
              solicita acceso al administrador.
            </p>
          </div>

          {/* ── Mensaje de feedback ── */}
          {mensaje && (
            <div className={`admin-feedback admin-feedback--${mensaje.type}`}>
              {mensaje.type === "ok" ? "✅" : "⚠️"} {mensaje.text}
            </div>
          )}

          {/* ── Grid de tarjetas ── */}
          <div className="admin-grid">
            {subAdminSections.map((section) => {
              const necesitaPermiso = REQUIEREN_PERMISO.includes(section.label);
              const accesoConcedido = tienePermiso(section.label);
              const bloqueada = necesitaPermiso && !accesoConcedido;

              return (
                <div key={section.href} className="admin-card-wrapper">
                  {/* Tarjeta — navega solo si tiene acceso */}
                  {accesoConcedido ? (
                    <Link href={section.href} className="admin-card-link">
                      <TarjetaContenido
                        section={section}
                        bloqueada={false}
                        necesitaPermiso={necesitaPermiso}
                        accesoConcedido={accesoConcedido}
                      />
                    </Link>
                  ) : (
                    <TarjetaContenido
                      section={section}
                      bloqueada={bloqueada}
                      necesitaPermiso={necesitaPermiso}
                      accesoConcedido={accesoConcedido}
                    />
                  )}

                  {/* Overlay de candado */}
                  {bloqueada && (
                    <div className="admin-card__lock-overlay">
                      <FaLock size={22} color="#1b396a" />
                      <button
                        className="admin-card__request-btn"
                        onClick={() => handleSolicitarAcceso(section.label)}
                        disabled={solicitando === section.label}
                      >
                        {solicitando === section.label
                          ? "Enviando..."
                          : "Solicitar acceso"}
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

/* ── Componente de tarjeta reutilizable ── */
function TarjetaContenido({
  section,
  bloqueada,
  necesitaPermiso,
  accesoConcedido,
}) {
  return (
    <div
      className={[
        "admin-card",
        section.highlight ? "admin-card--highlight" : "",
        bloqueada ? "admin-card--blocked" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Ícono */}
      <div className="admin-card__icon">{section.icon}</div>

      {/* Cuerpo */}
      <div className="admin-card__body">
        <div className="admin-card__title-row">
          <span className="admin-card__label">{section.label}</span>
          {section.highlight && <span className="admin-card__badge">DASH</span>}
        </div>

        <p className="admin-card__desc">{section.desc}</p>

        {/* Badge de permiso — solo en secciones que lo requieren */}
        {necesitaPermiso && (
          <span
            className={`admin-card__perm-badge${accesoConcedido ? " admin-card__perm-badge--granted" : ""}`}
          >
            {accesoConcedido ? "🔓 Acceso concedido" : "🔒 Requiere permiso"}
          </span>
        )}
      </div>
    </div>
  );
}
