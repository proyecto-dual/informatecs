"use client";
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import {
  calcularTotales,
  filtrarInscripciones,
  obtenerTipoActividad,
} from "@/app/utils/Inscripcionesutils";
import TarjetasTotales from "@/app/components/TarjetasTotales";
import ActividadCard from "@/app/components/ActividadCard";
import ModalValidarSangre from "@/app/components/ ModalValidarSangre";
import ModalDetalleEstudiante from "@/app/components/ModalDetalleEstudiante";
import "@/styles/admin/InscripcionesPanel.css";
const InscripcionesPanel = () => {
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [inscripciones, setInscripciones] = useState({});
  const [actividadExpandida, setActividadExpandida] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalValidarSangre, setModalValidarSangre] = useState(null);
  const [modalDetalleEstudiante, setModalDetalleEstudiante] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroSemestre, setFiltroSemestre] = useState("");
  const [filtroSexo, setFiltroSexo] = useState("");
  const [filtroTipoActividad, setFiltroTipoActividad] = useState("");
  const [filtroProposito, setFiltroProposito] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const filtros = { filtroSemestre, filtroSexo, filtroProposito };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ── API ────────────────────────────────────────────────────────────────────
  const onValidar = async (id, aluctr, mensaje = "") => {
    try {
      const res = await fetch(`/api/sangre`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluctr,
          accion: "aprobar",
          // Si mensaje es "", el backend limpiará el campo en la BD
          mensaje: mensaje,
        }),
      });

      if (res.ok) {
        // Invalida la cache de React Query para refrescar la lista
        queryClient.invalidateQueries(["inscripciones"]);
        alert(
          "Proceso completado: Se ha validado y limpiado el historial de mensajes.",
        );
      }
    } catch (error) {
      console.error("Error al validar:", error);
    }
  };
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resOfertas, resInscripciones] = await Promise.all([
        fetch("/api/act-disponibles", { cache: "no-store" }),
        fetch("/api/inscripciones", { cache: "no-store" }),
      ]);

      const ofertas = await resOfertas.json();

      if (!resInscripciones.ok) {
        setActividadesOfertadas(Array.isArray(ofertas) ? ofertas : []);
        setInscripciones({});
        return;
      }

      const raw = await resInscripciones.json();
      const todasInscripciones = Array.isArray(raw) ? raw : [];
      const inscripcionesPorActividad = {};

      todasInscripciones.forEach((i) => {
        const actId = i?.actividadId;
        if (actId) {
          if (!inscripcionesPorActividad[actId])
            inscripcionesPorActividad[actId] = [];
          inscripcionesPorActividad[actId].push(i);
        }
      });

      setActividadesOfertadas(Array.isArray(ofertas) ? ofertas : []);
      setInscripciones(inscripcionesPorActividad);
    } catch {
      setActividadesOfertadas([]);
      setInscripciones({});
    } finally {
      setLoading(false);
    }
  };

  const handleValidarSangre = async (inscripcionId, aluctr) => {
    try {
      const response = await fetch("/api/admin/validar-sangre", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inscripcionId, aluctr }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al validar");
      alert(`✅ ${data.mensaje}`);
      setModalValidarSangre(null);
      await cargarDatos();
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };

  // ── Datos derivados ────────────────────────────────────────────────────────

  const actividadesFiltradas = actividadesOfertadas.filter((oferta) => {
    const nombre = (
      oferta.actividad?.aconco ||
      oferta.actividad?.aticve ||
      ""
    ).toLowerCase();
    const tipo = obtenerTipoActividad(
      oferta.actividad?.aticve,
      oferta.actividad?.aconco,
      oferta.actividad?.acodes,
    );
    if (!nombre.includes(busqueda.toLowerCase())) return false;
    if (filtroTipoActividad && tipo !== filtroTipoActividad) return false;
    if (filtroSemestre || filtroSexo || filtroProposito) {
      return (inscripciones[oferta.actividadId] || []).some(
        (i) => filtrarInscripciones([i], filtros).length > 0,
      );
    }
    return true;
  });

  const totales = calcularTotales(actividadesFiltradas, inscripciones, filtros);

  const semestreOptions = [
    ...new Set(
      Object.values(inscripciones)
        .flat()
        .map((i) => i.estudiante?.calnpe)
        .filter((s) => s != null),
    ),
  ].sort((a, b) => Number(a) - Number(b));

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroSemestre("");
    setFiltroSexo("");
    setFiltroTipoActividad("");
    setFiltroProposito("");
  };

  const filtrosActivos = [
    filtroSemestre,
    filtroSexo,
    filtroTipoActividad,
    filtroProposito,
  ].filter(Boolean).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading)
    return <div className="ip-loading">Cargando inscripciones...</div>;

  return (
    <div className="ip-page">
      <div className="ip-container">
        {/* ── Header ── */}
        <div className="ip-header">
          <h2 className="ip-header-title">Inscripciones por Actividad</h2>
          <p className="ip-header-subtitle">
            Lista de estudiantes inscritos en cada actividad
          </p>
        </div>

        {/* ── Estadísticas ── */}
        <TarjetasTotales totales={totales} />

        {/* ── Filtros ── */}
        <div className="ip-filters">
          <div className="ip-search-row">
            <div className="ip-search-wrap">
              <Search className="ip-search-icon" size={18} />
              <input
                type="text"
                className="ip-search-input"
                placeholder="Buscar actividad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              className={`ip-filter-toggle${mostrarFiltros ? " ip-filter-toggle--active" : ""}`}
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter size={18} />
              Filtros
              {filtrosActivos > 0 && (
                <span className="ip-filter-count">{filtrosActivos}</span>
              )}
            </button>
          </div>

          {mostrarFiltros && (
            <div className="ip-filter-panel">
              <div className="ip-filter-field">
                <label className="ip-filter-label">Semestre</label>
                <select
                  className="ip-filter-select"
                  value={filtroSemestre}
                  onChange={(e) => setFiltroSemestre(e.target.value)}
                >
                  <option value="">Todos</option>
                  {semestreOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}° Semestre
                    </option>
                  ))}
                </select>
              </div>
              <div className="ip-filter-field">
                <label className="ip-filter-label">Sexo</label>
                <select
                  className="ip-filter-select"
                  value={filtroSexo}
                  onChange={(e) => setFiltroSexo(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="ip-filter-field">
                <label className="ip-filter-label">Tipo de Actividad</label>
                <select
                  className="ip-filter-select"
                  value={filtroTipoActividad}
                  onChange={(e) => setFiltroTipoActividad(e.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="CIVICA">Cívica</option>
                  <option value="CULTURAL">Cultural</option>
                  <option value="DEPORTIVA">Deportiva</option>
                  <option value="OTRA">Otra</option>
                </select>
              </div>
              <div className="ip-filter-field">
                <label className="ip-filter-label">Propósito</label>
                <select
                  className="ip-filter-select"
                  value={filtroProposito}
                  onChange={(e) => setFiltroProposito(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="creditos">Créditos</option>
                  <option value="servicio_social">Servicio Social</option>
                  <option value="por_gusto">Por Gusto</option>
                </select>
              </div>
              <div className="ip-filter-clear">
                <button className="ip-clear-btn" onClick={limpiarFiltros}>
                  <X size={18} /> Limpiar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Lista de actividades ── */}
        <div className="ip-activities">
          {actividadesFiltradas.length === 0 ? (
            <div className="ip-empty">
              No se encontraron actividades con los filtros seleccionados
            </div>
          ) : (
            actividadesFiltradas.map((oferta) => {
              const tipoActividad = obtenerTipoActividad(
                oferta.actividad?.aticve,
                oferta.actividad?.aconco,
                oferta.actividad?.acodes,
              );
              const inscritosFiltrados = filtrarInscripciones(
                inscripciones[oferta.actividadId] || [],
                filtros,
              );
              const isExpanded = actividadExpandida === oferta.actividadId;

              return (
                <ActividadCard
                  key={oferta.id}
                  oferta={oferta}
                  tipoActividad={tipoActividad}
                  inscritosFiltrados={inscritosFiltrados}
                  isExpanded={isExpanded}
                  onToggle={() =>
                    setActividadExpandida(
                      isExpanded ? null : oferta.actividadId,
                    )
                  }
                  onVerEstudiante={setModalDetalleEstudiante}
                  onValidarSangre={setModalValidarSangre}
                />
              );
            })
          )}
        </div>

        {/* ── Modales ── */}
        {modalValidarSangre && (
          <ModalValidarSangre
            inscripcion={modalValidarSangre}
            onClose={() => setModalValidarSangre(null)}
            onValidar={handleValidarSangre}
          />
        )}

        {modalDetalleEstudiante && (
          <ModalDetalleEstudiante
            inscripcion={modalDetalleEstudiante}
            onClose={() => setModalDetalleEstudiante(null)}
          />
        )}
      </div>
    </div>
  );
};

export default InscripcionesPanel;
