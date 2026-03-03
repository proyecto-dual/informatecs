"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarMaestro from "@/app/components/layout/navbarmaestro";
import {
  FiBook,
  FiUsers,
  FiClock,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiDownload,
} from "react-icons/fi";
import "./materias.css";

export default function MisMateriasMaestroPage() {
  const router = useRouter();
  const [maestroData, setMaestroData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materiaExpandida, setMateriaExpandida] = useState(null);
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("maestroData");

    if (!savedData) {
      router.push("/designs/vistaLogin");
      return;
    }

    const parsed = JSON.parse(savedData);
    setMaestroData(parsed);
    cargarMaterias(parsed.percve);
  }, [router]);

  const cargarMaterias = async (percve) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/maestros-materias?percve=${percve}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error de la API:", errorData);
        setMaterias([]);
        return;
      }

      const data = await response.json();
      setMaterias(data || []);
    } catch (error) {
      console.error("Error al cargar materias:", error);
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleMateria = (materiaId) => {
    setMateriaExpandida(materiaExpandida === materiaId ? null : materiaId);
  };

  const exportarEstudiantes = (materia) => {
    const estudiantes = materia.inscripact.map((inscripcion) => {
      const est = inscripcion.estudiante;
      const nombreCompleto = `${est.alunom || ""} ${est.aluapp || ""} ${
        est.aluapm || ""
      }`.trim();

      return {
        "No. Control": est.aluctr,
        Nombre: nombreCompleto,
        Semestre: est.inscripciones?.calnpe || "N/A",
        Carrera: est.inscripciones?.carrera?.carnco || "N/A",
        Sexo: est.alusex === 1 ? "M" : est.alusex === 2 ? "F" : "N/A",
        "Fecha Inscripción": new Date(
          inscripcion.fechaInscripcion,
        ).toLocaleDateString(),
      };
    });

    const csv = [
      Object.keys(estudiantes[0]).join(","),
      ...estudiantes.map((est) => Object.values(est).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estudiantes_${materia.aticve}_${Date.now()}.csv`;
    a.click();
  };

  const filtrarEstudiantes = (inscripciones) => {
    if (!busquedaEstudiante) return inscripciones;

    return inscripciones.filter((inscripcion) => {
      const est = inscripcion.estudiante;
      const nombreCompleto = `${est.alunom || ""} ${est.aluapp || ""} ${
        est.aluapm || ""
      }`.toLowerCase();
      const busqueda = busquedaEstudiante.toLowerCase();

      return (
        est.aluctr?.toString().includes(busqueda) ||
        nombreCompleto.includes(busqueda)
      );
    });
  };

  if (loading) {
    return (
      <div className="maestros">
        <div className="materias-loading-screen">
          <div className="loader-circle"></div>
          <p className="loader-text">Cargando tus materias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="maestros">
      <div className="materias-main-wrapper">
        {/* Header */}
        <div className="materias-header">
          <div className="header-content">
            <div>
              <h1 className="header-title">
                <FiBook className="inline-icon" />
                Mis Materias
              </h1>
              <p className="header-subtitle">
                Gestiona tus materias y estudiantes asignados
              </p>
            </div>
            <div className="header-stats">
              <div className="materias-stat-badge">
                <FiBook />
                <span>{materias.length} Materias</span>
              </div>
              <div className="materias-stat-badge">
                <FiUsers />
                <span>
                  {materias.reduce(
                    (acc, m) => acc + (m.inscripact?.length || 0),
                    0,
                  )}{" "}
                  Estudiantes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="materias-content">
          {materias.length === 0 ? (
            <div className="materias-empty">
              <FiBook size={64} className="empty-icon" />
              <h2>No tienes materias asignadas</h2>
              <p>
                Contacta con el administrador para que te asigne materias este
                semestre.
              </p>
            </div>
          ) : (
            <div className="materias-grid">
              {materias.map((materia) => {
                const isExpanded = materiaExpandida === materia.id;
                const totalEstudiantes = materia.inscripact?.length || 0;
                const estudiantesFiltrados = filtrarEstudiantes(
                  materia.inscripact || [],
                );

                return (
                  <div key={materia.id} className="materia-card">
                    {/* Header de la materia */}
                    <div
                      className="materia-card-header"
                      onClick={() => toggleMateria(materia.id)}
                    >
                      <div className="materia-info">
                        <h3 className="materia-nombre">
                          {materia.aconco || materia.aticve}
                        </h3>
                        <div className="materia-meta">
                          <span className="meta-item">
                            <FiBook size={14} />
                            Código: {materia.aticve}
                          </span>
                          <span className="meta-item">
                            <FiUsers size={14} />
                            {totalEstudiantes} estudiantes
                          </span>
                          <span className="meta-item">
                            <FiClock size={14} />
                            {materia.acohrs} horas
                          </span>
                        </div>

                        {materia.horario && (
                          <div className="materia-horario">
                            <FiCalendar size={14} />
                            <span>
                              {materia.horario.dias?.join(", ")} •{" "}
                              {materia.horario.horaInicio} -{" "}
                              {materia.horario.horaFin}
                            </span>
                            {materia.horario.salon && (
                              <span className="salon">
                                • {materia.horario.salon}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="materia-actions">
                        <span className="estudiantes-badge">
                          {totalEstudiantes}
                        </span>
                        {isExpanded ? (
                          <FiChevronUp size={24} />
                        ) : (
                          <FiChevronDown size={24} />
                        )}
                      </div>
                    </div>

                    {/* Lista de estudiantes (expandible) */}
                    {isExpanded && (
                      <div className="materia-card-body">
                        {totalEstudiantes === 0 ? (
                          <div className="estudiantes-empty">
                            <FiUsers size={48} />
                            <p>No hay estudiantes inscritos aún</p>
                          </div>
                        ) : (
                          <>
                            <div className="estudiantes-toolbar">
                              <div className="search-box">
                                <FiSearch className="search-icon" />
                                <input
                                  type="text"
                                  placeholder="Buscar estudiante..."
                                  value={busquedaEstudiante}
                                  onChange={(e) =>
                                    setBusquedaEstudiante(e.target.value)
                                  }
                                />
                              </div>
                              <button
                                className="btn-export"
                                onClick={() => exportarEstudiantes(materia)}
                              >
                                <FiDownload size={16} />
                                Exportar
                              </button>
                            </div>

                            <div className="estudiantes-table-wrapper">
                              <table className="estudiantes-table">
                                <thead>
                                  <tr>
                                    <th>No. Control</th>
                                    <th>Nombre Completo</th>
                                    <th>Semestre</th>
                                    <th>Carrera</th>
                                    <th>Sexo</th>
                                    <th>Fecha Inscripción</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {estudiantesFiltrados.length === 0 ? (
                                    <tr>
                                      <td colSpan="6" className="no-results">
                                        No se encontraron estudiantes
                                      </td>
                                    </tr>
                                  ) : (
                                    estudiantesFiltrados.map((inscripcion) => {
                                      const est = inscripcion.estudiante;
                                      const nombreCompleto = `${
                                        est.alunom || ""
                                      } ${est.aluapp || ""} ${
                                        est.aluapm || ""
                                      }`.trim();

                                      return (
                                        <tr key={inscripcion.id}>
                                          <td className="font-mono">
                                            {est.aluctr}
                                          </td>
                                          <td className="font-semibold">
                                            {nombreCompleto || "Sin nombre"}
                                          </td>
                                          <td>
                                            {est.inscripciones?.calnpe || "N/A"}
                                            °
                                          </td>
                                          <td className="carrera-cell">
                                            {est.inscripciones?.carrera
                                              ?.carnco || "N/A"}
                                          </td>
                                          <td>
                                            <span
                                              className={`sexo-badge ${
                                                est.alusex === 1
                                                  ? "masculino"
                                                  : "femenino"
                                              }`}
                                            >
                                              {est.alusex === 1
                                                ? "M"
                                                : est.alusex === 2
                                                  ? "F"
                                                  : "N/A"}
                                            </span>
                                          </td>
                                          <td className="fecha-cell">
                                            {new Date(
                                              inscripcion.fechaInscripcion,
                                            ).toLocaleDateString("es-MX", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>

                            <div className="estudiantes-footer">
                              <p>
                                Mostrando {estudiantesFiltrados.length} de{" "}
                                {totalEstudiantes} estudiantes
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
