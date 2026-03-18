"use client";
import { useState, useEffect } from "react";
import "@/styles/admin/Reportes.css";
import {
  Search,
  FileText,
  CheckCircle,
  Clock,
  Filter,
  Download,
} from "lucide-react";

export default function VistaReportes() {
  const [inscripciones, setInscripciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroActividad, setFiltroActividad] = useState("todas");
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const cargarInscripciones = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inscripciones", { cache: "no-store" });
      const data = await res.json();

      const aprobadas = data.filter(
        (i) => (i.calificacion || 0) >= 70 && i.estudiante && i.actividad,
      );

      setInscripciones(aprobadas);

      const actividadesUnicas = [
        ...new Set(
          aprobadas.map(
            (i) => i.actividad?.aconco || i.actividad?.aticve || "Sin nombre",
          ),
        ),
      ].sort();

      setActividades(actividadesUnicas);
    } catch (error) {
      console.error("Error cargando inscripciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtradas = inscripciones.filter((i) => {
    const e = i.estudiante;
    const a = i.actividad;

    const nombre =
      `${e.alunom || ""} ${e.aluapp || ""} ${e.aluapm || ""}`.toLowerCase();
    const control = (e.aluctr || "").toLowerCase();
    const act = (a.aconco || a.aticve || "").toLowerCase();

    const coincideBusqueda =
      nombre.includes(busqueda.toLowerCase()) ||
      control.includes(busqueda.toLowerCase()) ||
      act.includes(busqueda.toLowerCase());

    const coincideActividad =
      filtroActividad === "todas" || (a.aconco || a.aticve) === filtroActividad;

    return coincideBusqueda && coincideActividad;
  });

  const exportarCSV = () => {
    const headers = [
      "No. Control",
      "Nombre Completo",
      "Correo",
      "Actividad",
      "Código",
      "Créditos",
      "Horas",
      "Calificación",
    ];

    const rows = filtradas.map((i) => {
      const e = i.estudiante;
      const a = i.actividad;
      return [
        e.aluctr,
        `${e.alunom} ${e.aluapp} ${e.aluapm}`,
        e.alumai,
        a.aconco || a.aticve,
        a.aticve,
        a.acocre,
        a.acohrs,
        i.calificacion,
      ];
    });

    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Reporte_Aprobados_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="reportes-dashboard-container">
      <div className="reportes-dashboard-wrapper">
        {/* Header */}
        <div className="reportes-card reportes-header">
          <div className="reportes-header-left">
            <CheckCircle size={32} className="reportes-icon" />
            <div>
              <h1 className="reportes-title">Lista de Estudiantes Aprobados</h1>
              <p className="reportes-subtitle">
                Calificación mínima aprobatoria ≥ 70
              </p>
            </div>
          </div>
          <button
            className="reportes-btn-primary"
            onClick={exportarCSV}
            disabled={filtradas.length === 0}
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>

        {/* Estadísticas */}
        <div className="reportes-stats-grid">
          <div className="reportes-stat-card">
            <p className="reportes-stat-label">Total Aprobados</p>
            <p className="reportes-stat-number">{inscripciones.length}</p>
          </div>
          <div className="reportes-stat-card">
            <p className="reportes-stat-label">Actividades Distintas</p>
            <p className="reportes-stat-number">{actividades.length}</p>
          </div>
          <div className="reportes-stat-card">
            <p className="reportes-stat-label">Resultados Filtrados</p>
            <p className="reportes-stat-number">{filtradas.length}</p>
          </div>
        </div>

        {/* Buscador y Filtro */}
        <div className="reportes-card reportes-filters">
          <div className="reportes-input-group">
            <Search className="reportes-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, control o actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="reportes-input-group">
            <Filter className="reportes-icon" size={18} />
            <select
              value={filtroActividad}
              onChange={(e) => setFiltroActividad(e.target.value)}
            >
              <option value="todas">Todas las actividades</option>
              {actividades.map((act, idx) => (
                <option key={idx} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="reportes-card reportes-table-container">
          {loading ? (
            <div className="reportes-loading">
              <Clock className="reportes-spin" size={30} />
              <p>Cargando estudiantes...</p>
            </div>
          ) : (
            <table className="reportes-table">
              <thead>
                <tr>
                  <th>No. Control</th>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Actividad</th>
                  <th>Código</th>
                  <th>Créditos</th>
                  <th>Horas</th>
                  <th>Calificación</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((i, idx) => {
                  const e = i.estudiante;
                  const a = i.actividad;
                  return (
                    <tr key={idx}>
                      <td>{e.aluctr}</td>
                      <td>{`${e.alunom} ${e.aluapp} ${e.aluapm}`}</td>
                      <td>{e.alumai}</td>
                      <td>{a.aconco || a.aticve}</td>
                      <td>{a.aticve}</td>
                      <td>{a.acocre}</td>
                      <td>{a.acohrs}</td>
                      <td>
                        <span className="reportes-badge-score">
                          {i.calificacion}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
