"use client";
import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";
import "@/styles/alumno/cons.css";
import { descargarConstanciaPDF } from "@/app/utils/pdf-generator";
export default function MisConstancias() {
  const [constancias, setConstancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [numeroControl, setNumeroControl] = useState(null);
  const [descargando, setDescargando] = useState(null);

  /* ===============================
     OBTENER NÚMERO DE CONTROL
  =============================== */

  useEffect(() => {
    const obtenerNumeroControl = () => {
      let numControl = null;

      try {
        const studentDataStr = localStorage.getItem("studentData");
        if (studentDataStr) {
          const studentData = JSON.parse(studentDataStr);
          numControl = studentData.numeroControl || studentData.aluctr;
          if (numControl) {
            localStorage.setItem("numeroControl", numControl);
          }
        }
      } catch (error) {
        console.error("Error leyendo studentData:", error);
      }

      if (!numControl) {
        numControl =
          localStorage.getItem("numeroControl") ||
          sessionStorage.getItem("numeroControl") ||
          localStorage.getItem("aluctr");
      }

      return numControl;
    };

    const numControl = obtenerNumeroControl();

    if (numControl) {
      setNumeroControl(numControl);
      cargarConstancias(numControl);
    } else {
      setLoading(false);
      window.location.href = "/designs/vistaLogin";
    }
  }, []);

  /* ===============================
     CARGAR CONSTANCIAS
  =============================== */

  const cargarConstancias = async (numControl) => {
    try {
      setLoading(true);
      const numeroSeguro = encodeURIComponent(numControl.trim());

      const response = await fetch(
        `/api/constancias?numeroControl=${numeroSeguro}`,
        { cache: "no-store" },
      );

      if (!response.ok) throw new Error("Error al cargar constancias");

      const data = await response.json();
      setConstancias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setConstancias([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DESCARGA PDF
  =============================== */

  const manejarDescarga = async (constancia) => {
    try {
      setDescargando(constancia.id);

      // Asegúrate que esta función esté importada
      await descargarConstanciaPDF({ ...constancia });

      setDescargando(null);
    } catch (error) {
      console.error(error);
      setDescargando(null);
      alert("No se pudo generar el PDF.");
    }
  };

  /* ===============================
     FILTROS
  =============================== */

  const constanciasFiltradas = useMemo(() => {
    return constancias.filter((c) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        c.actividadNombre?.toLowerCase().includes(texto) ||
        c.folio?.toLowerCase().includes(texto);

      const fecha = new Date(c.fechaEmision);
      const anio = !isNaN(fecha) ? fecha.getFullYear().toString() : "";
      const coincideAnio = !filtroAnio || anio === filtroAnio;

      return coincideBusqueda && coincideAnio;
    });
  }, [constancias, busqueda, filtroAnio]);

  const aniosDisponibles = [
    ...new Set(
      constancias
        .map((c) => new Date(c.fechaEmision))
        .filter((f) => !isNaN(f))
        .map((f) => f.getFullYear()),
    ),
  ].sort((a, b) => b - a);

  /* ===============================
     LOADING
  =============================== */

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Cargando constancias...</p>
        </div>
      </div>
    );
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <>
      {/* ===========================
          BANNER
      =========================== */}
      <section className="user-banner">
        <div className="constancia-title">
          <h3>Mis Constancias</h3>
          <div className="title-stats-group">
            <div className="stats-card">
              <div className="stats-number">{constanciasFiltradas.length}</div>
              <div className="stats-label">Emitidas</div>
            </div>
          </div>
        </div>
        {numeroControl && (
          <div className="user-control">
            Número de control: <strong>{numeroControl}</strong>
          </div>
        )}
      </section>

      {/* ===========================
          CONTENEDOR
      =========================== */}
      <div className="main-container">
        {/* ===========================
            FILTROS
        =========================== */}
        <div className="search-filters-card">
          <div className="filters-grid">
            <div className="input-wrapper">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Buscar por actividad o folio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={filtroAnio}
              onChange={(e) => setFiltroAnio(e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los años</option>
              {aniosDisponibles.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>

          <div className="results-counter">
            Mostrando{" "}
            <span className="highlight">{constanciasFiltradas.length}</span>{" "}
            resultado(s)
          </div>
        </div>

        {/* ===========================
            LISTA
        =========================== */}
        <div className="constancias-list">
          {constanciasFiltradas.length > 0 ? (
            constanciasFiltradas.map((c) => (
              <div key={c.id} className="constancia-card">
                <div className="constancia-content">
                  <div className="constancia-layout">
                    <div>
                      <div className="badge-valid">
                        <CheckCircle size={14} />
                        Válida
                      </div>

                      <div className="badge-folio">{c.folio}</div>

                      <h2 className="constancia-acti">{c.actividadNombre}</h2>

                      <div className="constancia-details">
                        <div>
                          <Calendar size={16} />{" "}
                          {new Date(c.fechaEmision).toLocaleDateString("es-MX")}
                        </div>

                        <div>
                          <Award size={16} /> {c.acreditacion}
                        </div>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn-primary-cons"
                        onClick={() => manejarDescarga(c)}
                        disabled={descargando === c.id}
                      >
                        <Download size={16} />
                        Descargar PDF
                      </button>

                      <a
                        href={`/verificar/${c.folio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        <ExternalLink size={16} />
                        Verificar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <FileText size={32} />
              </div>

              <h3 className="empty-title">No tienes constancias aún</h3>

              <p className="empty-description">
                Cuando completes actividades complementarias, aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
