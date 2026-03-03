"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarMaestro from "@/app/components/layout/navbarmaestro";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBook,
  FiAlertCircle,
} from "react-icons/fi";
import "./horario.css";

export default function VistaMiHorarioPage() {
  const router = useRouter();
  const [maestroData, setMaestroData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

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
      const materiasConHorario = data.filter((m) => m.horario);
      setMaterias(materiasConHorario || []);
    } catch (error) {
      console.error("Error al cargar materias:", error);
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  const getColorMateria = (index) => {
    const colores = [
      { bg: "#e0f2fe", border: "#0ea5e9", text: "#075985" },
      { bg: "#fce7f3", border: "#ec4899", text: "#9f1239" },
      { bg: "#ddd6fe", border: "#8b5cf6", text: "#5b21b6" },
      { bg: "#d1fae5", border: "#10b981", text: "#065f46" },
      { bg: "#fed7aa", border: "#f59e0b", text: "#92400e" },
      { bg: "#fecaca", border: "#ef4444", text: "#991b1b" },
    ];
    return colores[index % colores.length];
  };

  const getMateriaEnDia = (materia, dia) => {
    if (!materia.horario || !materia.horario.dias) return false;
    return materia.horario.dias.includes(dia);
  };

  if (loading) {
    return (
      <div className="maestros">
        <div className="horario-loading-screen">
          <div className="loader-circle"></div>
          <p className="loader-text">Cargando horario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="maestros">
      <div className="horario-main-wrapper">
        <div className="horario-header">
          <div className="header-content">
            <div>
              <h1 className="header-title">
                <FiCalendar className="inline-icon" />
                Mi Horario
              </h1>
              <p className="header-subtitle">
                Visualiza tus materias y horarios asignados
              </p>
            </div>
            <div className="header-stats">
              <div className="stat-badge stat-purple">
                <FiBook />
                <span>{materias.length} Materias</span>
              </div>
            </div>
          </div>
        </div>

        {/* Horario semanal */}
        {materias.length === 0 ? (
          <div className="horario-empty">
            <FiAlertCircle size={64} className="empty-icon" />
            <h2>No tienes materias con horario asignado</h2>
            <p>
              Contacta con el administrador para que te asigne materias con
              horarios este semestre.
            </p>
          </div>
        ) : (
          <div className="horario-container">
            <div className="horario-grid-wrapper">
              <table className="horario-table">
                <thead>
                  <tr>
                    <th className="horario-header-materia">Materia</th>
                    {diasSemana.map((dia) => (
                      <th key={dia} className="horario-header-dia">
                        {dia}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materias.map((materia, index) => {
                    const color = getColorMateria(index);
                    return (
                      <tr key={materia.id}>
                        {/* Columna de Materia */}
                        <td
                          className="horario-materia-cell"
                          style={{
                            background: color.bg,
                            borderLeft: `4px solid ${color.border}`,
                          }}
                        >
                          <div
                            className="materia-nombre-row"
                            style={{ color: color.text }}
                          >
                            <FiBook size={16} />
                            <span>{materia.aconco || materia.aticve}</span>
                          </div>
                          <div className="materia-codigo-row">
                            Código: {materia.aticve}
                          </div>
                        </td>

                        {/* Columnas de días */}
                        {diasSemana.map((dia) => {
                          const tieneClase = getMateriaEnDia(materia, dia);
                          return (
                            <td
                              key={`${materia.id}-${dia}`}
                              className={`horario-cell ${
                                tieneClase ? "horario-cell-filled" : ""
                              }`}
                              style={
                                tieneClase
                                  ? {
                                      background: color.bg,
                                      borderLeft: `3px solid ${color.border}`,
                                    }
                                  : {}
                              }
                            >
                              {tieneClase && (
                                <div
                                  className="horario-info"
                                  style={{ color: color.text }}
                                >
                                  <div className="horario-hora">
                                    <FiClock size={14} />
                                    {materia.horario.horaInicio} -{" "}
                                    {materia.horario.horaFin}
                                  </div>
                                  {materia.horario?.salon && (
                                    <div className="horario-salon">
                                      <FiMapPin size={14} />
                                      {materia.horario.salon}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
