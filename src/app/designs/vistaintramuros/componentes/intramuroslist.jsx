"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../estilos/actividades.css";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
  FaClock,
} from "react-icons/fa";
import ModalInscripcion from "./formulariointra";

// ================= CONFIGURACIÓN API =================
const API_PROXY_URL = "/api/intramuros";

// ================= FUNCIONES AUXILIARES (ZONA HORARIA TIJUANA) =================

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;

  // Forzamos la visualización en el horario de Tijuana para evitar desfases de día
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Tijuana",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";

  // Si Google Sheets envía un string simple "HH:mm", lo respetamos
  if (
    typeof timeString === "string" &&
    timeString.length === 5 &&
    timeString.includes(":")
  ) {
    return timeString;
  }

  const date = new Date(timeString);
  if (isNaN(date)) return "N/A";

  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Tijuana",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const getStatusClass = (status) => {
  const s = status?.toLowerCase().trim();
  if (s === "abierto") return "status-open";
  if (s === "en curso" || s === "proceso") return "status-inprogress";
  if (s === "cerrado") return "status-closed";
  return "status-default";
};

// ================= COMPONENTE PRINCIPAL =================

const IntramurosList = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalActivo, setModalActivo] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchActividades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_PROXY_URL}?hoja=lista`);
      if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

      const result = await response.json();

      // Ajustamos para leer result.data que viene del API Route corregido
      if (result && result.status === "success" && Array.isArray(result.data)) {
        setActividades(result.data);
      } else {
        throw new Error(result.message || "Formato de respuesta inválido.");
      }
    } catch (err) {
      setError(err.message || "Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActividades();
  }, [fetchActividades]);

  const handleSuccessfulSubmit = (msg) => {
    setModalActivo(null);
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const filteredActividades = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return actividades;

    return actividades.filter((a) => {
      const content = [
        a.ID_Actividad,
        a.Nombre_Actividad,
        a.Actividad,
        a.Deporte_o_Area,
        a.Coordinador,
      ]
        .join(" ")
        .toLowerCase();
      return content.includes(term);
    });
  }, [actividades, searchTerm]);

  // ================= RENDER =================

  if (loading)
    return <div className="loading-state">Cargando actividades...</div>;

  return (
    <div className="intramuros-list-wrapper">
      <header className="list-header">
        <div className="titulo-banner">
          <FaCalendarAlt className="header-icon" />
          <h2>Registro de Actividades Intramuros</h2>
        </div>
      </header>

      {successMessage && (
        <div className="alert alert-success">✅ {successMessage}</div>
      )}

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
          <button onClick={fetchActividades} className="btn-retry">
            Reintentar
          </button>
        </div>
      )}

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Buscar actividad, área o coordinador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="intramuros-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Área</th>
              <th>Coordinador</th>
              <th>Fecha / Hora</th>
              <th>Lugar</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredActividades.length > 0 ? (
              filteredActividades.map((a, index) => (
                <tr key={`${a.ID_Actividad}-${index}`}>
                  <td data-label="ID">{a.ID_Actividad}</td>
                  <td data-label="Actividad" className="font-bold">
                    {a.Nombre_Actividad || a.Actividad}
                  </td>
                  <td data-label="Área">
                    {a.Deporte_o_Area || a.Deporte_Area}
                  </td>
                  <td data-label="Coordinador">
                    <FaUserTie className="icon-small" />{" "}
                    {a.Coordinador || "N/A"}
                  </td>
                  <td data-label="Fecha / Hora">
                    <div className="datetime-cell">
                      <span>{formatDate(a.Fecha_Inicio)}</span>
                      <small>
                        <FaClock /> {formatTime(a.Hora_Inicio)}
                      </small>
                    </div>
                  </td>
                  <td data-label="Lugar">{a.Lugar_Sede}</td>
                  <td data-label="Estado">
                    <span
                      className={`status-badge ${getStatusClass(a.Estado)}`}
                    >
                      {a.Estado || "Abierto"}
                    </span>
                  </td>
                  <td data-label="Acción">
                    {a.Estado?.toLowerCase() === "abierto" ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => setModalActivo(a)}
                      >
                        Inscribirme
                      </button>
                    ) : (
                      <button className="btn" disabled>
                        No disponible
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalActivo && (
        <ModalInscripcion
          actividad={modalActivo}
          onClose={() => setModalActivo(null)}
          onSuccessfulSubmit={handleSuccessfulSubmit}
        />
      )}
    </div>
  );
};

export default IntramurosList;
