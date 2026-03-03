"use client";
import React, { useState } from "react";
import { Trophy, Plus, X, Send, Loader2 } from "lucide-react";
import "../css/seccionpartidos.css";

const WEB_APP_URL = "/api/intramuros";

const SeccionPartidos = ({ actividades, resultados, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    Fecha: new Date().toISOString().split("T")[0],
    Actividad: "",
    Equipo_Local: "",
    Marcador_L: "0",
    Marcador_V: "0",
    Equipo_Visitante: "",
  });

  const handleSavePartido = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const pL = parseInt(form.Marcador_L || 0);
    const pV = parseInt(form.Marcador_V || 0);
    let ganadorFinal = "Empate";
    if (pL > pV) ganadorFinal = form.Equipo_Local;
    else if (pV > pL) ganadorFinal = form.Equipo_Visitante;

    const dataToSend = {
      action: "saveResult",
      hoja: "partidos",
      Fecha: form.Fecha,
      Actividad: form.Actividad,
      "Equipo Local": form.Equipo_Local,
      Marcador: `${pL} - ${pV}`,
      "Equipo Visitante": form.Equipo_Visitante,
      Ganador: ganadorFinal,
    };

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(dataToSend),
      });

      setShowModal(false);
      setForm({
        ...form,
        Equipo_Local: "",
        Equipo_Visitante: "",
        Marcador_L: "0",
        Marcador_V: "0",
      });
      setTimeout(() => {
        onRefresh();
      }, 1500);
    } catch {
      alert("Error al conectar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pt-wrapper">
      {/* ── Header sin fondo ── */}
      <div className="pt-header">
        <div>
          <h2 className="pt-header__title">
            <Trophy size={22} className="pt-header__title-icon" />
            Partidos
          </h2>
          <p className="pt-header__sub">Hoja: partidos</p>
        </div>
        <button className="pt-btn-new" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Registrar Resultado
        </button>
      </div>

      {/* ── Tabla ── */}
      <div className="pt-table-wrap">
        <table className="pt-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Torneo</th>
              <th className="right">Local</th>
              <th className="center">Marcador</th>
              <th>Visitante</th>
              <th className="center">Ganador</th>
            </tr>
          </thead>
          <tbody>
            {resultados && resultados.length > 0 ? (
              resultados.map((res, i) => (
                <tr key={i}>
                  <td className="pt-td-fecha">{res.Fecha}</td>
                  <td className="pt-td-torneo">{res.Actividad}</td>
                  <td className="right pt-td-equipo">
                    {res["Equipo Local"] || res.Equipo_Local}
                  </td>
                  <td className="center">
                    <span className="pt-marcador">{res.Marcador}</span>
                  </td>
                  <td className="pt-td-equipo">
                    {res["Equipo Visitante"] || res.Equipo_Visitante}
                  </td>
                  <td className="center">
                    <span
                      className={`pt-badge ${res.Ganador === "Empate" ? "pt-badge--empate" : "pt-badge--ganador"}`}
                    >
                      {res.Ganador}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="pt-empty">
                  No hay datos disponibles en la hoja "partidos".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="pt-overlay">
          <div className="pt-modal">
            <div className="pt-modal__header">
              <h3 className="pt-modal__title">Nuevo Resultado</h3>
              <button
                className="pt-modal__close"
                onClick={() => setShowModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePartido} className="pt-modal__body">
              <select
                required
                className="pt-form-select"
                value={form.Actividad}
                onChange={(e) =>
                  setForm({ ...form, Actividad: e.target.value })
                }
              >
                <option value="">¿A qué torneo pertenece?</option>
                {actividades.map((a, i) => (
                  <option key={i} value={a.Nombre_Actividad || a.Actividad}>
                    {a.Nombre_Actividad || a.Actividad}
                  </option>
                ))}
              </select>

              <div className="pt-score-grid">
                <div className="pt-score-col">
                  <input
                    className="pt-form-input"
                    placeholder="Equipo Local"
                    required
                    onChange={(e) =>
                      setForm({ ...form, Equipo_Local: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="pt-form-score"
                    value={form.Marcador_L}
                    onChange={(e) =>
                      setForm({ ...form, Marcador_L: e.target.value })
                    }
                  />
                </div>
                <div className="pt-score-col">
                  <input
                    className="pt-form-input"
                    placeholder="Equipo Visitante"
                    required
                    onChange={(e) =>
                      setForm({ ...form, Equipo_Visitante: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="pt-form-score"
                    value={form.Marcador_V}
                    onChange={(e) =>
                      setForm({ ...form, Marcador_V: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>

            <div className="pt-modal__footer">
              <button
                className="pt-btn-submit"
                disabled={enviando}
                onClick={handleSavePartido}
              >
                {enviando ? (
                  <Loader2 size={18} className="spin" />
                ) : (
                  <Send size={18} />
                )}
                {enviando ? "Publicando..." : "Guardar Marcador"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionPartidos;
