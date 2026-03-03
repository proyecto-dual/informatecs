"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy, TrendingUp, Filter } from "lucide-react";
// ✅ Corregido: Salir de 'componentes' para entrar en 'styles'
import "../estilos/IntramurosResults.css";
// Cambia la URL para apuntar específicamente a la hoja de resultados
const RESULTS_API_URL = "/api/intramuros?hoja=resultado";

const IntramurosResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivityID, setSelectedActivityID] = useState(null);
  const [activityList, setActivityList] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(RESULTS_API_URL);
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

        const result = await response.json();

        // Log para que verifiques los nombres de las columnas en la consola del navegador console.log("Datos recibidos de Google Sheets:", result);

        if (result.status === "success" && Array.isArray(result.data)) {
          const dataArray = result.data;

          // Mapeo de actividades usando los nombres exactos de tu Excel
          const uniqueActivitiesMap = dataArray.reduce((acc, current) => {
            const id = current.ID_Actividad;
            const nombre = current.Actividad;

            if (id && nombre && !acc[id]) {
              acc[id] = nombre;
            }
            return acc;
          }, {});

          const activities = Object.keys(uniqueActivitiesMap).map((id) => ({
            ID: id,
            Nombre: uniqueActivitiesMap[id],
          }));

          setResults(dataArray);
          setActivityList(activities);

          if (activities.length > 0) {
            setSelectedActivityID(activities[0].ID);
          }
        }
      } catch (e) {
        setError(`Error al obtener datos: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const chartDetails = useMemo(() => {
    if (!selectedActivityID || results.length === 0) {
      return { chartData: [], dataKey: "Puntaje_Final", yAxisLabel: "Puntos" };
    }

    // Filtrado por ID_Actividad (asegurando coincidencia de tipos)
    const filteredResults = results
      .filter((r) => String(r.ID_Actividad) === String(selectedActivityID))
      .sort((a, b) => (Number(a.Posicion) || 0) - (Number(b.Posicion) || 0));

    if (filteredResults.length === 0)
      return { chartData: [], dataKey: "Puntaje_Final", yAxisLabel: "Puntos" };

    const firstResult = filteredResults[0];
    const unitLabel = firstResult.Unidad || "Puntos";

    const chartData = filteredResults.map((r) => {
      // Prioridad: Nombre_Equipo > Nombre_Participante
      const etiquetaPrincipal =
        r.Nombre_Equipo && r.Nombre_Equipo !== "Individual"
          ? r.Nombre_Equipo
          : r.Nombre_Participante || "Participante";

      // Limpieza de valores numéricos (maneja casos donde el Excel envía texto)
      const valorNumerico =
        typeof r.Puntaje_Final === "string"
          ? parseFloat(r.Puntaje_Final.replace(",", "."))
          : parseFloat(r.Puntaje_Final);

      return {
        name: `${r.Posicion || "S/P"}° ${etiquetaPrincipal}`,
        Puntaje_Final: valorNumerico || 0,
        unidad: r.Unidad || "Puntos",
        participante: r.Nombre_Participante || "N/A",
        equipo: r.Nombre_Equipo || "Individual",
      };
    });

    return { chartData, dataKey: "Puntaje_Final", yAxisLabel: unitLabel };
  }, [results, selectedActivityID]);

  const { chartData, dataKey, yAxisLabel } = chartDetails;

  if (loading)
    return (
      <div className="intramuros-container">
        <div className="loading-state">Cargando estadísticas...</div>
      </div>
    );

  return (
    <div className="intramuros-container">
      <header className="intramuros-header">
        <div className="header-info">
          <div className="header-icon">
            <Trophy size={28} />
          </div>
          <div className="intramuros-title">
            <h1>Ranking y Estadísticas</h1>
            <p>Instituto Tecnológico de Ensenada</p>
          </div>
        </div>
        <div className="filter-container">
          <Filter size={18} className="filter-icon" />
          <select
            value={selectedActivityID || ""}
            onChange={(e) => setSelectedActivityID(e.target.value)}
            className="activity-select"
          >
            {activityList.map((act) => (
              <option key={act.ID} value={act.ID}>
                {act.Nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="content-area">
        {chartData.length > 0 ? (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  label={{
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} ${props.payload.unidad}`,
                    props.payload.equipo !== "Individual"
                      ? `Equipo: ${props.payload.equipo}`
                      : `Participante: ${props.payload.participante}`,
                  ]}
                />
                <Bar dataKey={dataKey} fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="no-data-state">
            <TrendingUp size={48} />
            <p>No hay resultados disponibles para esta actividad.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntramurosResults;
