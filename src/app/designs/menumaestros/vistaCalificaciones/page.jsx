"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from "@react-pdf/renderer";

import {
  FiBook,
  FiUsers,
  FiArrowLeft,
  FiSave,
  FiDownload,
  FiEdit,
  FiCheck,
  FiX,
} from "react-icons/fi";
import "./calificaciones.css";
import ActaPDF from "@/app/components/ActaPdf";

export default function VistaCalificacionesPage() {
  const router = useRouter();
  const [maestroData, setMaestroData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [calificaciones, setCalificaciones] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

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
        setMaterias([]);
        return;
      }
      const data = await response.json();
      setMaterias(data || []);
    } catch (error) {
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarMateria = async (materia) => {
    setMateriaSeleccionada(materia);
    try {
      const response = await fetch(
        `/api/calificaciones?actividadId=${materia.id}&maestroId=${maestroData.percve}`,
        { cache: "no-store" },
      );

      if (!response.ok) throw new Error("Error al cargar");

      const inscripciones = await response.json();
      const calificacionesIniciales = {};

      if (Array.isArray(inscripciones)) {
        inscripciones.forEach((inscripcion) => {
          calificacionesIniciales[inscripcion.estudiante.aluctr] = {
            calificacion: inscripcion.calificacion || "",
            observaciones: inscripcion.formularioData?.observaciones || "",
            liberado: inscripcion.liberado || false,
          };
        });
      }
      setCalificaciones(calificacionesIniciales);
    } catch (error) {
      const calificacionesVacias = {};
      if (Array.isArray(materia.inscripact)) {
        materia.inscripact.forEach((ins) => {
          if (ins?.estudiante?.aluctr) {
            calificacionesVacias[ins.estudiante.aluctr] = {
              calificacion: ins.calificacion || "",
              observaciones: ins.observaciones || "",
              liberado: ins.liberado || false,
            };
          }
        });
      }
      setCalificaciones(calificacionesVacias);
    }
  };

  const handleCalificacionChange = (aluctr, valor) => {
    setCalificaciones((prev) => ({
      ...prev,
      [aluctr]: { ...prev[aluctr], calificacion: valor },
    }));
  };

  const handleObservacionChange = (aluctr, valor) => {
    setCalificaciones((prev) => ({
      ...prev,
      [aluctr]: { ...prev[aluctr], observaciones: valor },
    }));
  };

  const guardarCalificaciones = async () => {
    try {
      setGuardando(true);
      const response = await fetch("/api/calificaciones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actividadId: materiaSeleccionada.id,
          maestroId: maestroData.percve,
          calificaciones: calificaciones,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const resultado = await response.json();
      alert(`✅ Se guardaron las calificaciones correctamente`);
      setModoEdicion(false);
      await cargarMaterias(maestroData.percve);
      await seleccionarMateria(materiaSeleccionada);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="calificaciones-loading-screen">
        <div className="loader-circle"></div>
        <p className="loader-text">Cargando materias...</p>
      </div>
    );
  }

  if (!materiaSeleccionada) {
    return (
      <div className="calificaciones-main-wrapper">
        <div className="calificaciones-header">
          <div className="header-content">
            <div>
              <h1 className="header-title">
                <FiBook className="inline-icon" /> Calificaciones
              </h1>
              <p className="header-subtitle">
                Selecciona una materia para evaluar
              </p>
            </div>
            <div className="header-stats">
              <div className="stat-badge stat-purple">
                <FiBook /> <span>{materias.length} Materias</span>
              </div>
              <div className="stat-badge stat-blue">
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

        <div className="calificaciones-content">
          {materias.length === 0 ? (
            <div className="materias-empty">
              <FiBook size={64} className="empty-icon" />
              <h2>No tienes materias asignadas</h2>
            </div>
          ) : (
            <div className="materias-grid">
              {materias.map((materia) => {
                const total = materia.inscripact?.length || 0;
                const evaluados =
                  materia.inscripact?.filter((ins) => ins.calificacion)
                    .length || 0;
                return (
                  <div
                    key={materia.id}
                    className="materia-card-calif"
                    onClick={() => seleccionarMateria(materia)}
                  >
                    <div className="materia-card-header-calif">
                      <h3>{materia.aconco || materia.aticve}</h3>
                      <span className="materia-codigo">
                        Código: {materia.aticve}
                      </span>
                    </div>
                    <div className="materia-stats">
                      <div className="stat-item">
                        <FiUsers /> <span>{total} Estudiantes</span>
                      </div>
                      <div className="stat-item">
                        <FiCheck /> <span>{evaluados} Evaluados</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${total > 0 ? (evaluados / total) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                    <button className="btn-evaluar">
                      Evaluar estudiantes →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="calificaciones-main-wrapper">
      <div className="calificaciones-header-detalle">
        <button
          className="btn-back"
          onClick={() => {
            setMateriaSeleccionada(null);
            setModoEdicion(false);
          }}
        >
          <FiArrowLeft size={20} /> Volver
        </button>

        <div className="header-info">
          <h1>{materiaSeleccionada.aconco || materiaSeleccionada.aticve}</h1>
          <p>Código: {materiaSeleccionada.aticve}</p>
        </div>

        <div className="header-actions">
          {!modoEdicion ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => setModoEdicion(true)}
              >
                <FiEdit size={18} /> Editar
              </button>

              <PDFDownloadLink
                document={
                  <ActaPDF
                    materia={materiaSeleccionada}
                    maestro={maestroData}
                    calificaciones={calificaciones}
                  />
                }
                fileName={`Acta_${materiaSeleccionada.aticve}.pdf`}
              >
                {({ loading }) => (
                  <button className="btn btn-secondary" disabled={loading}>
                    <FiDownload size={18} />{" "}
                    {loading ? "Cargando..." : "Acta PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            </>
          ) : (
            <>
              <button
                className="btn btn-success"
                onClick={guardarCalificaciones}
                disabled={guardando}
              >
                <FiSave size={18} /> {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setModoEdicion(false)}
              >
                <FiX size={18} /> Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="calificaciones-table-container">
        <table className="calificaciones-table">
          <thead>
            <tr>
              <th>#</th>
              <th>No. Control</th>
              <th>Nombre Completo</th>
              <th>Semestre</th>
              <th>Calificación</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {materiaSeleccionada.inscripact?.map((ins, index) => {
              const est = ins.estudiante;
              const calif = calificaciones[est.aluctr]?.calificacion || "";
              const obs = calificaciones[est.aluctr]?.observaciones || "";
              return (
                <tr key={est.aluctr}>
                  <td>{index + 1}</td>
                  <td>{est.aluctr}</td>
                  <td>{`${est.alunom} ${est.aluapp} ${est.aluapm}`}</td>
                  <td>{est.inscripciones?.calnpe || "N/A"}°</td>
                  <td>
                    {modoEdicion ? (
                      <input
                        type="number"
                        className="input-calificacion"
                        value={calif}
                        onChange={(e) =>
                          handleCalificacionChange(est.aluctr, e.target.value)
                        }
                      />
                    ) : (
                      <span
                        className={`calificacion-badge ${calif >= 70 ? "aprobado" : "reprobado"}`}
                      >
                        {calif || "N/A"}
                      </span>
                    )}
                  </td>
                  <td>
                    {modoEdicion ? (
                      <input
                        type="text"
                        className="input-observacion"
                        value={obs}
                        onChange={(e) =>
                          handleObservacionChange(est.aluctr, e.target.value)
                        }
                      />
                    ) : (
                      <span className="observacion-text">{obs || "-"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
