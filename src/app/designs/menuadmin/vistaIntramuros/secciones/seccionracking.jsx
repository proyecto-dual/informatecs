import React, { useState } from "react";
import { TrendingUp, Shield, Medal } from "lucide-react";
import "../css/seccionrackings.css";

const SeccionRankings = ({ resultados, actividades }) => {
  const [selectedTorneo, setSelectedTorneo] = useState("");

  const torneosExistentes = [
    ...new Set(resultados.map((r) => r.Actividad)),
  ].filter(Boolean);

  const stats = {};

  resultados.forEach((res) => {
    if (selectedTorneo && res.Actividad !== selectedTorneo) return;

    const local = res["Equipo Local"] || res.Equipo_Local || res.Local;
    const visitante =
      res["Equipo Visitante"] || res.Equipo_Visitante || res.Visitante;
    const ganador = res.Ganador;

    if (!local || !visitante) return;

    [local, visitante].forEach((eq) => {
      if (!stats[eq])
        stats[eq] = { nombre: eq, pj: 0, v: 0, e: 0, d: 0, pts: 0 };
    });

    stats[local].pj++;
    stats[visitante].pj++;

    if (ganador === "Empate" || ganador === "empate") {
      stats[local].e++;
      stats[visitante].e++;
      stats[local].pts += 1;
      stats[visitante].pts += 1;
    } else if (ganador === local) {
      stats[local].v++;
      stats[visitante].d++;
      stats[local].pts += 3;
    } else if (ganador === visitante) {
      stats[visitante].v++;
      stats[local].d++;
      stats[visitante].pts += 3;
    }
  });

  const ranking = Object.values(stats).sort((a, b) =>
    b.pts !== a.pts ? b.pts - a.pts : b.v - a.v,
  );

  const renderPos = (idx) => {
    if (idx === 0) return <Medal size={20} className="rk-pos-gold" />;
    if (idx === 1) return <Medal size={20} className="rk-pos-silver" />;
    if (idx === 2) return <Medal size={20} className="rk-pos-bronze" />;
    return <span className="rk-pos-num">{idx + 1}</span>;
  };

  return (
    <div className="rk-wrapper">
      {/* ── Header sin fondo ── */}
      <div className="rk-header">
        <div>
          <h2 className="rk-header__title">
            <TrendingUp size={22} className="rk-header__title-icon" />
            Tabla de Posiciones
          </h2>
          <p className="rk-header__sub">
            Clasificación en tiempo real basada en resultados
          </p>
        </div>

        <select
          className="rk-select"
          onChange={(e) => setSelectedTorneo(e.target.value)}
        >
          <option value="">Todos los torneos</option>
          {torneosExistentes.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* ── Tabla ── */}
      <div className="rk-table-wrap">
        <table className="rk-table">
          <thead>
            <tr>
              <th className="center" style={{ width: 70 }}>
                Rango
              </th>
              <th>Club / Equipo</th>
              <th className="center">PJ</th>
              <th className="center rk-th-v">V</th>
              <th className="center rk-th-e">E</th>
              <th className="center rk-th-d">D</th>
              <th className="rk-th-pts">Total PTS</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length > 0 ? (
              ranking.map((eq, idx) => (
                <tr key={idx}>
                  <td className="center">
                    <div className="rk-pos-icon">{renderPos(idx)}</div>
                  </td>
                  <td>
                    <div className="rk-td-equipo">
                      <div className="rk-td-shield">
                        <Shield size={18} />
                      </div>
                      <span className="rk-td-name">{eq.nombre}</span>
                    </div>
                  </td>
                  <td className="center rk-td-pj">{eq.pj}</td>
                  <td className="center rk-td-v">{eq.v}</td>
                  <td className="center rk-td-ed">{eq.e}</td>
                  <td className="center rk-td-ed">{eq.d}</td>
                  <td className="center">
                    <span className="rk-pts-badge">{eq.pts}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="rk-empty">
                  No hay resultados registrados para este torneo aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Leyenda ── */}
      <div className="rk-legend">
        <div className="rk-legend__item">
          <div className="rk-legend__dot rk-legend__dot--gray" />
          PJ: Partidos Jugados
        </div>
        <div className="rk-legend__item">
          <div className="rk-legend__dot rk-legend__dot--green" />
          V: Victorias (3 pts)
        </div>
        <div className="rk-legend__item">
          <div className="rk-legend__dot rk-legend__dot--yellow" />
          E: Empates (1 pt)
        </div>
        <div className="rk-legend__item">
          <div className="rk-legend__dot rk-legend__dot--red" />
          D: Derrotas (0 pts)
        </div>
      </div>
    </div>
  );
};

export default SeccionRankings;
