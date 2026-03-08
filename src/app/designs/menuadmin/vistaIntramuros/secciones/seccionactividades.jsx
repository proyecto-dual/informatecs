import React from "react";
import { Plus, MapPin, Edit, CircleCheck, CircleX } from "lucide-react";
import "../css/seccionactividades.css";

const SectionActividades = ({ data, inscripciones, onEdit, onNew }) => {
  const getNumEq = (act) =>
    [
      ...new Set(
        inscripciones
          .filter(
            (i) =>
              i.ID_Actividad?.toString() === act.ID_Actividad?.toString() &&
              i.Nombre_Equipo !== "Individual",
          )
          .map((i) => i.Nombre_Equipo?.toLowerCase().trim()),
      ),
    ].length;

  return (
    <div className="sa-wrapper">
      {/* ── Header ── */}
      <div className="sa-header">
        <div>
          <h2 className="sa-header__title">Torneos Activos</h2>
          <p className="sa-header__sub">{data.length} torneos registrados</p>
        </div>
        <button className="sa-btn-new" onClick={onNew}>
          <Plus size={16} />
          Nueva Actividad
        </button>
      </div>

      {/* ══════════════════════════════════════════
          TABLA — visible solo en tablet/escritorio
         ══════════════════════════════════════════ */}
      <div className="sa-table-wrap sa-desktop-only">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th className="center">Estado</th>
              <th className="center">Equipos</th>
              <th className="center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="sa-empty">
                  No hay actividades registradas
                </td>
              </tr>
            ) : (
              data.map((act, idx) => {
                const numEq = getNumEq(act);
                const isOpen = act.Estado?.toLowerCase() === "abierto";
                return (
                  <tr key={idx}>
                    <td>
                      <div className="sa-td-name">{act.Nombre_Actividad}</div>
                      <div className="sa-td-location">
                        <MapPin size={11} />
                        {act.Lugar_Sede}
                      </div>
                    </td>
                    <td className="center">
                      <span
                        className={`sa-badge ${isOpen ? "sa-badge--open" : "sa-badge--closed"}`}
                      >
                        {isOpen ? (
                          <CircleCheck size={11} />
                        ) : (
                          <CircleX size={11} />
                        )}
                        {act.Estado}
                      </span>
                    </td>
                    <td className="center">
                      <div className="sa-td-count">
                        {numEq} / {act.Capacidad_Maxima}
                        <span>inscritos</span>
                      </div>
                    </td>
                    <td className="center">
                      <button
                        className="sa-btn-edit"
                        onClick={() => onEdit(act)}
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════
          CARDS — visible solo en móvil
         ══════════════════════════════════════════ */}
      <div className="sa-cards sa-mobile-only">
        {data.length === 0 ? (
          <div className="sa-empty-card">No hay actividades registradas</div>
        ) : (
          data.map((act, idx) => {
            const numEq = getNumEq(act);
            const isOpen = act.Estado?.toLowerCase() === "abierto";
            return (
              <div key={idx} className="sa-card">
                {/* Encabezado */}
                <div className="sa-card__head">
                  <div className="sa-td-name">{act.Nombre_Actividad}</div>
                  <div className="sa-td-location">
                    <MapPin size={11} />
                    {act.Lugar_Sede}
                  </div>
                </div>

                {/* Filas de datos */}
                <div className="sa-card__row">
                  <span className="sa-card__label">Estado</span>
                  <span
                    className={`sa-badge ${isOpen ? "sa-badge--open" : "sa-badge--closed"}`}
                  >
                    {isOpen ? <CircleCheck size={11} /> : <CircleX size={11} />}
                    {act.Estado}
                  </span>
                </div>

                <div className="sa-card__row">
                  <span className="sa-card__label">Equipos</span>
                  <div className="sa-td-count sa-td-count--right">
                    {numEq} / {act.Capacidad_Maxima}
                    <span>inscritos</span>
                  </div>
                </div>

                <div className="sa-card__row sa-card__row--last">
                  <span className="sa-card__label">Acciones</span>
                  <button
                    className="sa-btn-edit sa-btn-edit--card"
                    onClick={() => onEdit(act)}
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SectionActividades;
