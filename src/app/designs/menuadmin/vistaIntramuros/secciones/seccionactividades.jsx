import React from "react";
import { Plus, MapPin, Edit, CircleCheck, CircleX } from "lucide-react";

import "../css/seccionactividades.css";
const SectionActividades = ({ data, inscripciones, onEdit, onNew }) => (
  <div className="sa-wrapper">
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

    {/* ── Tabla ── */}
    <div className="sa-table-wrap">
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
              const numEq = [
                ...new Set(
                  inscripciones
                    .filter(
                      (i) =>
                        i.ID_Actividad?.toString() ===
                          act.ID_Actividad?.toString() &&
                        i.Nombre_Equipo !== "Individual",
                    )
                    .map((i) => i.Nombre_Equipo?.toLowerCase().trim()),
                ),
              ].length;

              const isOpen = act.Estado?.toLowerCase() === "abierto";

              return (
                <tr key={idx}>
                  {/* Nombre + sede */}
                  <td>
                    <div className="sa-td-name">{act.Nombre_Actividad}</div>
                    <div className="sa-td-location">
                      <MapPin size={11} />
                      {act.Lugar_Sede}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="center">
                    <span
                      className={`sa-badge ${
                        isOpen ? "sa-badge--open" : "sa-badge--closed"
                      }`}
                    >
                      {isOpen ? (
                        <CircleCheck size={11} />
                      ) : (
                        <CircleX size={11} />
                      )}
                      {act.Estado}
                    </span>
                  </td>

                  {/* Contador equipos */}
                  <td className="center">
                    <div className="sa-td-count">
                      {numEq} / {act.Capacidad_Maxima}
                      <span>inscritos</span>
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="center">
                    <button
                      className="sa-btn-edit"
                      onClick={() => onEdit(act)}
                      title="Editar actividad"
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
  </div>
);

export default SectionActividades;
