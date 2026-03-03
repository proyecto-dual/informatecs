"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  MapPin,
  Award,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import { FaRunning } from "react-icons/fa";
import "./horario.css";

import Footer from "@/app/components/layout/footer";

export default function HorariosActividades() {
  const [actividades, setActividades] = useState([]);
  const [actividadesFiltradas, setActividadesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroDia, setFiltroDia] = useState("todos");

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  useEffect(() => {
    cargarActividades();
  }, []);

  useEffect(() => {
    filtrarActividades();
  }, [actividades, filtroTexto, filtroDia]);

  const cargarActividades = async () => {
    try {
      const response = await fetch("/api/actividades");
      const data = await response.json();

      // Filtrar solo actividades con horario asignado
      const conHorario = data.filter(
        (act) =>
          act.horario &&
          act.horario.dias &&
          Array.isArray(act.horario.dias) &&
          act.horario.dias.length > 0,
      );

      setActividades(conHorario);
      setActividadesFiltradas(conHorario);
    } catch (error) {
      console.error("Error cargando actividades:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarActividades = () => {
    let resultado = [...actividades];

    // Filtrar por texto
    if (filtroTexto) {
      resultado = resultado.filter(
        (act) =>
          act.aconco?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
          act.aticve?.toLowerCase().includes(filtroTexto.toLowerCase()),
      );
    }

    // Filtrar por día
    if (filtroDia !== "todos") {
      resultado = resultado.filter(
        (act) => act.horario?.dias && act.horario.dias.includes(filtroDia),
      );
    }

    setActividadesFiltradas(resultado);
  };

  if (loading) {
    return (
      <div className="horarios-page">
        <div className="horarios-loading">
          <div className="horarios-spinner"></div>
          <p>Cargando horarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="horarios-page">
      <main className="horarios-main">
        <div className="horarios-header">
          <div className="horarios-header-content">
            <h1>Horarios de Actividades</h1>
            <p className="horarios-subtitle">
              Consulta los horarios asignados para cada actividad y realiza tu
              inscripción si el horario se ajusta a tu disponibilidad.
            </p>
          </div>
        </div>

        <div className="horarios-filtros">
          <div className="filtro-busqueda">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
        </div>

        {/* Contador */}
        <div className="horarios-contador">
          <p>
            Mostrando <strong>{actividadesFiltradas.length}</strong> de{" "}
            <strong>{actividades.length}</strong> actividades con horario
            asignado
          </p>
        </div>

        {/* Lista de actividades */}
        {actividadesFiltradas.length === 0 ? (
          <div className="horarios-empty">
            <AlertCircle size={64} />
            <h2>No se encontraron actividades</h2>
            <p>
              {actividades.length === 0
                ? "Aún no hay actividades con horarios asignados."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
          </div>
        ) : (
          <div className="horarios-grid">
            {actividadesFiltradas.map((actividad) => (
              <div className="horario-card" key={actividad.id}>
                <div className="horario-card-header">
                  <div className="horario-icon">
                    <FaRunning size={24} />
                  </div>
                  <div className="horario-title">
                    <h3>{actividad.aconco || "Sin nombre"}</h3>
                  </div>
                </div>

                <div className="horario-card-body">
                  <div className="horario-info-destacada">
                    <div className="info-item">
                      <Clock size={18} />
                      <span>
                        {actividad.horario.horaInicio} -{" "}
                        {actividad.horario.horaFin}
                      </span>
                    </div>
                  </div>

                  <div className="horario-dias">
                    <p className="dias-label">Días:</p>
                    <div className="dias-list">
                      {actividad.horario.dias.map((dia, idx) => (
                        <span className="dia-tag" key={idx}>
                          {dia}
                        </span>
                      ))}
                    </div>
                  </div>

                  <table className="horario-table-small">
                    <thead>
                      <tr>
                        <th>Día</th>
                        <th>Horario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actividad.horario.dias.map((dia, idx) => (
                        <tr key={idx}>
                          <td>{dia}</td>
                          <td>
                            {actividad.horario.horaInicio} -{" "}
                            {actividad.horario.horaFin}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
