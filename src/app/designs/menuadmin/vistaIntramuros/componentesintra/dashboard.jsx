import React from "react";
import {
  Calendar,
  Swords,
  Shield,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { StatCard } from "../componentesintra/admincards";
import "../css/dasboard.css";

const Dashboard = ({ actividades, resultados, inscripciones }) => {
  const torneosAbiertos =
    actividades?.filter((a) => a.Estado?.toLowerCase() === "abierto").length ||
    0;
  const torneosCerrados =
    actividades?.filter((a) => a.Estado?.toLowerCase() === "cerrado").length ||
    0;
  const resultadosRecientes = [...(resultados || [])].reverse();

  const obtenerTotalParticipantes = () => {
    const setUnico = new Set();
    inscripciones?.forEach((i) => {
      if (i.Nombre && i.Nombre !== "N/A")
        setUnico.add(i.Nombre.trim().toLowerCase());
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach((nom) => {
          const limpio = nom
            .replace(/\((M|F)\)/gi, "")
            .trim()
            .toLowerCase();
          if (limpio && limpio !== "n/a") setUnico.add(limpio);
        });
      }
    });
    return setUnico.size;
  };

  const equiposUnicos = [
    ...new Set(
      inscripciones
        ?.filter(
          (i) =>
            i.Nombre_Equipo &&
            i.Nombre_Equipo !== "Individual" &&
            i.Nombre_Equipo !== "N/A",
        )
        .map((i) => i.Nombre_Equipo.trim().toLowerCase()),
    ),
  ].length;

  const deportesCont = {};
  actividades?.forEach((a) => {
    const d = a.Deporte_o_Area || "Otro";
    deportesCont[d] = (deportesCont[d] || 0) + 1;
  });
  const topDeportes = Object.entries(deportesCont)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="db-wrapper">
      <div className="db-header">
        <div>
          <h2 className="db-header__title">Estadísticas</h2>
          <p className="db-header__sub">Resumen de actividad en tiempo real</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="db-stats-grid">
        <StatCard
          icon={<Calendar size={28} />}
          title="Torneos Activos"
          value={torneosAbiertos}
          subtitle={`${torneosCerrados} cerrados`}
          color="blue"
        />
        <StatCard
          icon={<Swords size={28} />}
          title="Partidos"
          value={resultados.length}
          subtitle="Resultados cargados"
          color="green"
        />
        <StatCard
          icon={<Shield size={28} />}
          title="Equipos"
          value={equiposUnicos}
          subtitle="Inscritos"
          color="purple"
        />
        <StatCard
          icon={<Users size={28} />}
          title="Atletas"
          value={obtenerTotalParticipantes()}
          subtitle="Personas únicas"
          color="orange"
        />
      </div>

      {/* ── Gráficos ── */}
      <div className="db-bottom-grid">
        {/* Popularidad por Deporte */}
        <div className="db-card">
          <p className="db-card__label">
            <TrendingUp size={14} className="db-card__label-icon" /> Popularidad
            por Deporte
          </p>
          <div className="db-bar-list">
            {topDeportes.map(([deporte, count], idx) => (
              <div key={idx} className="db-bar-row">
                <div className="db-bar-meta">
                  <span className="db-bar-meta__name">{deporte}</span>
                  <span className="db-bar-meta__count">{count}</span>
                </div>
                <div className="db-bar-track">
                  <div
                    className="db-bar-fill"
                    style={{
                      width: `${(count / (actividades?.length || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cronología de Resultados */}
        <div className="db-card">
          <p className="db-card__label">
            <Clock size={14} className="db-card__label-icon" /> Cronología de
            Resultados
          </p>
          <div className="db-results-list">
            {resultadosRecientes.length > 0 ? (
              resultadosRecientes.slice(0, 8).map((res, idx) => (
                <div key={idx} className="db-result-item">
                  <div className="db-result-item__body">
                    <p className="db-result-item__torneo">
                      {res.Actividad || "Torneo"}
                    </p>
                    <div className="db-result-item__match">
                      <span className="db-result-item__team">
                        {res.Equipo_Local}
                      </span>
                      <span className="db-result-item__vs">VS</span>
                      <span className="db-result-item__team">
                        {res.Equipo_Visitante}
                      </span>
                    </div>
                  </div>
                  <div className="db-result-item__score">
                    {res.Marcador || "0-0"}
                  </div>
                </div>
              ))
            ) : (
              <div className="db-empty">No hay resultados que mostrar</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
