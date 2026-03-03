"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMaestro from "@/app/components/layout/navbarmaestro";
import {
  FiBook,
  FiCalendar,
  FiUsers,
  FiClock,
  FiFileText,
  FiUser,
  FiAward,
  FiHome,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
import "./menumaestro.css";

export default function MenuMaestrosPage() {
  const router = useRouter();
  const [maestroData, setMaestroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("maestroData");

    if (!savedData) {
      router.push("/designs/vistaLogin");
      return;
    }

    const parsed = JSON.parse(savedData);
    setMaestroData(parsed);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="maestro-loading-screen">
        <div className="loader-circle"></div>
        <p className="loader-text">Cargando...</p>
      </div>
    );
  }

  if (!maestroData) {
    return (
      <div className="maestro-error-screen">
        <div className="error-icon">⚠️</div>
        <p>No se encontró información</p>
        <button onClick={() => router.push("/designs/vistaLogin")}>
          Volver al Login
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="maestro-interface">
        {/* Banner Superior */}
        <div className="top-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h1 className="banner-title">
                Prof.{" "}
                <span className="highlight">
                  {maestroData.nombreCompleto?.split(" ")[0]}
                </span>
              </h1>
              <p className="banner-subtitle">Sistema de Gestión Académica</p>
            </div>
            <div className="banner-badges">
              <span className="badge-cycle">
                <FiCalendar /> Ciclo 2025
              </span>
              <span className="badge-status">
                <FiCheckCircle /> Activo
              </span>
            </div>
          </div>
        </div>

        {/* Área de Estadísticas - Estilo Dashboard */}
        <div className="dashboard-area">
          <div className="metric-display">
            <div className="metric-large">
              <div className="metric-icon">
                <FiBook />
              </div>
              <div className="metric-content">
                <span className="metric-value">5</span>
                <span className="metric-label">Materias Activas</span>
              </div>
              <div className="metric-trend">
                <FiTrendingUp />
                <span>+0 este ciclo</span>
              </div>
            </div>

            <div className="metric-grid">
              <div className="metric-item">
                <div className="metric-item-icon">
                  <FiClock />
                </div>
                <div className="metric-item-content">
                  <h4>24 hrs</h4>
                  <p>Carga semanal</p>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-item-icon">
                  <FiUsers />
                </div>
                <div className="metric-item-content">
                  <h4>142</h4>
                  <p>Estudiantes</p>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-item-icon">
                  <FiCalendar />
                </div>
                <div className="metric-item-content">
                  <h4>Semana 14</h4>
                  <p>Avance del ciclo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Acciones - Estilo Lista/Barra */}
        <div className="actions-panel">
          <div className="panel-header">
            <h2 className="panel-title">Acciones Disponibles</h2>
            <div className="panel-divider"></div>
          </div>

          <div className="actions-list">
            <div
              className="action-row"
              onClick={() => router.push("/designs/menumaestros/perfil")}
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiUser />
                </div>
                <div className="action-info">
                  <h3>Mi Perfil</h3>
                  <p>Información personal y académica</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>

            <div
              className="action-row"
              onClick={() =>
                router.push("/designs/menumaestros/vistaMismaterias")
              }
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiBook />
                </div>
                <div className="action-info">
                  <h3>Mis Materias</h3>
                  <p>Gestiona 5 asignaturas activas</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>

            <div
              className="action-row"
              onClick={() =>
                router.push("/designs/menumaestros/vistaMihorario")
              }
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiClock />
                </div>
                <div className="action-info">
                  <h3>Mi Horario</h3>
                  <p>24 horas semanales programadas</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>

            <div
              className="action-row"
              onClick={() =>
                router.push("/designs/menumaestros/vistaCalificaciones")
              }
            >
              <div className="action-row-left">
                <div className="action-icon">
                  <FiAward />
                </div>
                <div className="action-info">
                  <h3>Calificaciones</h3>
                  <p>142 estudiantes asignados</p>
                </div>
              </div>
              <div className="action-row-right">
                <FiChevronRight className="action-arrow" />
              </div>
            </div>
          </div>
        </div>

        {/* Información Personal - Estilo Minimalista */}
        <div className="personal-info-section">
          <div className="info-header">
            <FiUser className="header-icon" />
            <h2>Identificación</h2>
          </div>

          <div className="info-table">
            <div className="table-row">
              <div className="table-cell label">
                <FiUser className="cell-icon" />
                <span>Nombre</span>
              </div>
              <div className="table-cell value">
                {maestroData.nombreCompleto}
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiFileText className="cell-icon" />
                <span>ID Profesor</span>
              </div>
              <div className="table-cell value">{maestroData.percve}</div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiMapPin className="cell-icon" />
                <span>Departamento</span>
              </div>
              <div className="table-cell value">
                {maestroData.departamento || "No asignado"}
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiMail className="cell-icon" />
                <span>Correo</span>
              </div>
              <div className="table-cell value email">
                {maestroData.correo || "No disponible"}
              </div>
            </div>

            <div className="table-row">
              <div className="table-cell label">
                <FiPhone className="cell-icon" />
                <span>Teléfono</span>
              </div>
              <div className="table-cell value">
                {maestroData.telefono || "No disponible"}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Estado Inferior */}
        <div className="status-bar">
          <div className="status-content">
            <div className="status-item">
              <span className="status-dot active"></span>
              <span>Sistema: Operativo</span>
            </div>
            <div className="status-divider"></div>
            <div className="status-item">
              <span>ID: {maestroData.percve}</span>
            </div>
            <div className="status-divider"></div>
            <div className="status-item">
              <span>Último acceso: Hoy</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
