import React, { useState, useEffect } from "react";
import "./styles/intramuros.css";

// 🚨 ¡IMPORTANTE! REEMPLAZA ESTA URL con tu URL REAL de la Implementación de Google Apps Script.
// Esta URL actuará como la "API" que lee tu Hoja de Google.
const DATA_SOURCE_URL =
  "https://script.google.com/macros/s/AKfycbwRIgRAtC4uBckgo3WBvWwAKIVXhaUppUCZlxyIevrhUzjusNrg9AmBg5XIiTmXVyLd/exec";

const IntramurosList = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Para la funcionalidad de búsqueda/filtro

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_SOURCE_URL);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setActividades(data);
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError(err.message || "No se pudieron cargar las actividades.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para asignar clases CSS según el estado de la actividad
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "abierto":
        return "status-open";
      case "en curso":
        return "status-inprogress";
      case "cerrado":
        return "status-closed";
      default:
        return "status-default";
    }
  };

  // Filtrado de las actividades por Actividad o Coordinador
  const filteredActividades = actividades.filter(
    (actividad) =>
      actividad.Actividad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actividad.Coordinador?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <div className="loading-message">Cargando actividades...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="intramuros-list-wrapper">
      <h2>Registro de Actividades Intramuros</h2>

      {/* Campo de búsqueda (Filtro) */}
      <input
        type="text"
        placeholder="Buscar por Actividad o Coordinador..."
        className="search-input"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="intramuros-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Actividad</th>
            <th>Área</th>
            <th>Coordinador</th>
            <th>Fecha Inicio</th>
            <th>Lugar</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredActividades.map((actividad, index) => (
            <tr key={actividad.ID_Actividad || index}>
              <td>{actividad.ID_Actividad}</td>
              <td>{actividad.Actividad}</td>
              <td>{actividad.Deporte_o_Area}</td>
              <td>{actividad.Coordinador}</td>
              <td>
                {actividad.Fecha_Inicio
                  ? new Date(actividad.Fecha_Inicio).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{actividad.Lugar_Sede}</td>
              <td>
                <span
                  className={`status-badge ${getStatusClass(actividad.Estado)}`}
                >
                  {actividad.Estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredActividades.length === 0 && !loading && (
        <p className="no-results">No se encontraron actividades.</p>
      )}
    </div>
  );
};

export default IntramurosList;
