import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  FileText,
  Edit2,
  Trash2,
  AlertTriangle,
  User,
  Building2,
  Users,
  Hash,
  Calendar,
  BookOpen,
} from "lucide-react";

export const ListaView = ({
  inscripciones = [],
  actividadesPersonales = [],
  expanded,
  toggleExpand,
  onEdit,
  onDelete,
  onRemoveDay,
}) => {
  if (inscripciones.length === 0 && actividadesPersonales.length === 0) {
    return (
      <div className="horario-empty-state">
        <FileText size={64} />
        <h2>Sin actividades</h2>
        <p>Agrega tus clases para comenzar a organizar tu horario.</p>
      </div>
    );
  }

  const handleToggle = (id) => {
    if (typeof toggleExpand === "function") toggleExpand(id);
  };

  const COLORES_INSCRITA = [
    "#1b396a",
    "#2563eb",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];

  return (
    <div className="horario-lista-container">
      <h2 className="horario-lista-title">
        <FileText size={24} />
        Resumen de Actividades
      </h2>

      <div className="horario-actividades-lista">
        {/* ══════════════════════════════════════════════════
            SECCIÓN: MATERIAS INSCRITAS
        ══════════════════════════════════════════════════ */}
        {inscripciones.map((item, index) => {
          const act = item.actividad || item;
          const horario = act?.horario || act?.horarioDetalle;
          const docente = item?.docente || act?.docente;

          const nombre = act?.aconco || act?.nombre || "Actividad sin nombre";
          const clave = act?.aticve || act?.codigo || "N/A";
          const creditos = act?.acocre || act?.creditos || null;
          const salon =
            horario?.salon || horario?.aula || act?.salon || act?.aula;
          const grupo = item?.grupo || act?.grupo || act?.acogru;
          const periodo = item?.periodo || act?.periodo;
          const tipo = act?.tipo || act?.modalidad;
          const docenteNombre =
            docente?.nombre_completo ||
            docente?.nombre ||
            (typeof docente === "string" ? docente : null) ||
            act?.nombreDocente;

          const diasArray = Array.isArray(horario?.dias)
            ? horario.dias
            : horario?.dias
              ? [horario.dias]
              : [];

          const id = `insc-${index}`;
          const isExpanded = expanded === id;
          const color = COLORES_INSCRITA[index % COLORES_INSCRITA.length];

          return (
            <div
              className={`lista-insc-card ${isExpanded ? "abierta" : ""}`}
              key={id}
              style={{ "--insc-color": color }}
            >
              {/* ── Cabecera ── */}
              <div
                className="lista-insc-header"
                onClick={() => handleToggle(id)}
              >
                <div
                  className="lista-insc-color-bar"
                  style={{ backgroundColor: color }}
                />

                <div className="lista-insc-info">
                  <div className="lista-insc-chips">
                    <span className="lista-chip clave">{clave}</span>
                    {creditos && (
                      <span className="lista-chip creditos">
                        <Award size={11} />
                        {creditos} cr.
                      </span>
                    )}
                    {tipo && <span className="lista-chip tipo">{tipo}</span>}
                    <span className="lista-chip inscrita">Inscrita</span>
                  </div>

                  <h3 className="lista-insc-nombre">{nombre}</h3>

                  {/* Resumen siempre visible */}
                  <div className="lista-insc-resumen">
                    {docenteNombre && (
                      <span className="lista-insc-resumen-item">
                        <User size={12} />
                        {docenteNombre}
                      </span>
                    )}
                    {horario && (
                      <span className="lista-insc-resumen-item">
                        <Clock size={12} />
                        {horario.horaInicio} – {horario.horaFin}
                        {diasArray.length > 0 && ` · ${diasArray.join(", ")}`}
                      </span>
                    )}
                    {salon && (
                      <span className="lista-insc-resumen-item">
                        <Building2 size={12} />
                        {salon}
                      </span>
                    )}
                  </div>
                </div>

                <button className="lista-toggle-btn">
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {/* ── Detalles expandidos ── */}
              {isExpanded && (
                <div className="lista-insc-body">
                  <div className="lista-detalles-grid">
                    {docenteNombre && (
                      <div className="lista-detalle">
                        <div
                          className="lista-detalle-icon"
                          style={{ background: `${color}18` }}
                        >
                          <User size={15} color={color} />
                        </div>
                        <div>
                          <p className="lista-detalle-label">Docente</p>
                          <p className="lista-detalle-valor">{docenteNombre}</p>
                        </div>
                      </div>
                    )}

                    {salon && (
                      <div className="lista-detalle">
                        <div
                          className="lista-detalle-icon"
                          style={{ background: `${color}18` }}
                        >
                          <Building2 size={15} color={color} />
                        </div>
                        <div>
                          <p className="lista-detalle-label">Salón / Aula</p>
                          <p className="lista-detalle-valor">{salon}</p>
                        </div>
                      </div>
                    )}

                    {horario && (
                      <div className="lista-detalle">
                        <div
                          className="lista-detalle-icon"
                          style={{ background: `${color}18` }}
                        >
                          <Clock size={15} color={color} />
                        </div>
                        <div>
                          <p className="lista-detalle-label">Horario</p>
                          <p className="lista-detalle-valor">
                            {horario.horaInicio} – {horario.horaFin}
                          </p>
                          {diasArray.length > 0 && (
                            <p className="lista-detalle-sub">
                              {diasArray.join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {grupo && (
                      <div className="lista-detalle">
                        <div
                          className="lista-detalle-icon"
                          style={{ background: `${color}18` }}
                        >
                          <Users size={15} color={color} />
                        </div>
                        <div>
                          <p className="lista-detalle-label">Grupo</p>
                          <p className="lista-detalle-valor">{grupo}</p>
                        </div>
                      </div>
                    )}

                    {periodo && (
                      <div className="lista-detalle">
                        <div
                          className="lista-detalle-icon"
                          style={{ background: `${color}18` }}
                        >
                          <Calendar size={15} color={color} />
                        </div>
                        <div>
                          <p className="lista-detalle-label">Periodo</p>
                          <p className="lista-detalle-valor">{periodo}</p>
                        </div>
                      </div>
                    )}

                    {clave !== "N/A" && (
                      <div className="lista-detalle">
                        <div
                          className="lista-detalle-icon"
                          style={{ background: `${color}18` }}
                        >
                          <Hash size={15} color={color} />
                        </div>
                        <div>
                          <p className="lista-detalle-label">Clave</p>
                          <p className="lista-detalle-valor">{clave}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {tipo && (
                    <div className="lista-tipo-tag">
                      <BookOpen size={12} />
                      {tipo}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* ══════════════════════════════════════════════════
            SECCIÓN: ACTIVIDADES PERSONALES
        ══════════════════════════════════════════════════ */}
        {actividadesPersonales.map((activity) => (
          <div
            className="horario-actividad-item personal-grouped"
            key={activity.id}
            style={{ borderLeft: `6px solid ${activity.color || "#3b82f6"}` }}
          >
            <div className="horario-actividad-header-personal">
              <div className="horario-personal-main-info">
                <div className="horario-header-flex">
                  <div>
                    <div className="horario-actividad-badge personal">
                      Personal
                    </div>
                    <h3>{activity.nombre}</h3>
                  </div>
                  <button
                    className="horario-btn-delete-all"
                    onClick={() => onDelete?.(activity.nombre)}
                    title="Eliminar toda la actividad"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="horario-dias-edit-list">
                  {(activity.diasPresentes || [activity.dia]).map(
                    (dia, idx) => {
                      const hEsp = activity.horariosEspeciales?.[dia];
                      const horaInicio = hEsp
                        ? hEsp.horaInicio
                        : activity.horaInicio;
                      const horaFin = hEsp ? hEsp.horaFin : activity.horaFin;

                      return (
                        <div
                          key={`${activity.id}-${dia}-${idx}`}
                          className={`horario-dia-edit-row ${hEsp ? "especial" : ""}`}
                        >
                          <div className="horario-dia-info">
                            <span className="horario-dia-tag">{dia}</span>
                            <div className="horario-time-container">
                              <span className="horario-time-info">
                                <Clock size={14} /> {horaInicio} - {horaFin}
                              </span>
                              {hEsp && (
                                <span className="badge-horario-diferente">
                                  <AlertTriangle size={12} /> Horario especial
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="horario-dia-actions">
                            <button
                              className="horario-btn-edit-day"
                              onClick={() => onEdit?.(activity, dia)}
                            >
                              <Edit2 size={14} />
                              <span>Editar</span>
                            </button>
                            <button
                              className="horario-btn-remove-day"
                              onClick={() => onRemoveDay?.(activity.id, dia)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ESTILOS ── */}
      <style jsx>{`
        /* ── LISTA CONTAINER ─────────────────────────────── */
        .horario-lista-container {
          padding: 20px;
        }

        .horario-lista-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .horario-actividades-lista {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ══ INSCRIPCIONES ══════════════════════════════════ */
        .lista-insc-card {
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          transition:
            box-shadow 0.2s,
            border-color 0.2s;
        }

        .lista-insc-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
        }

        .lista-insc-card.abierta {
          border-color: var(--insc-color);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
        }

        .lista-insc-header {
          display: flex;
          align-items: flex-start;
          padding: 16px 16px 16px 0;
          cursor: pointer;
          user-select: none;
          gap: 0;
        }

        .lista-insc-color-bar {
          width: 5px;
          min-height: 52px;
          border-radius: 0 5px 5px 0;
          margin-right: 14px;
          flex-shrink: 0;
          align-self: stretch;
        }

        .lista-insc-info {
          flex: 1;
          min-width: 0;
        }

        /* Chips */
        .lista-insc-chips {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .lista-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .lista-chip.clave {
          background: #f1f5f9;
          color: #475569;
        }
        .lista-chip.creditos {
          background: #fef3c7;
          color: #92400e;
        }
        .lista-chip.tipo {
          background: #ede9fe;
          color: #6d28d9;
        }
        .lista-chip.inscrita {
          background: linear-gradient(135deg, #1b396a, #2563eb);
          color: white;
        }

        /* Nombre */
        .lista-insc-nombre {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        /* Resumen compacto siempre visible */
        .lista-insc-resumen {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lista-insc-resumen-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: #64748b;
        }

        /* Toggle */
        .lista-toggle-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px 12px 4px 6px;
          flex-shrink: 0;
          transition: color 0.2s;
        }

        .lista-toggle-btn:hover {
          color: #475569;
        }

        /* ── DETALLES EXPANDIDOS ─────────────────────────── */
        .lista-insc-body {
          padding: 2px 16px 18px 23px;
          animation: listaExpandir 0.22s ease;
        }

        @keyframes listaExpandir {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lista-detalles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 12px;
        }

        .lista-detalle {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .lista-detalle-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .lista-detalle-label {
          font-size: 0.62rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin: 0 0 2px 0;
        }

        .lista-detalle-valor {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          line-height: 1.3;
        }

        .lista-detalle-sub {
          font-size: 0.72rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        .lista-tipo-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: #475569;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 6px;
        }

        /* ══ ACTIVIDADES PERSONALES ═════════════════════════ */
        .horario-actividad-item {
          background: white;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .horario-actividad-item:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
        }

        .horario-actividad-header-personal {
          padding: 16px 18px;
        }

        .horario-personal-main-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .horario-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .horario-actividad-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .horario-actividad-badge.personal {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white;
        }

        .horario-actividad-item h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .horario-btn-delete-all {
          background: transparent;
          color: #94a3b8;
          border: none;
          padding: 6px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .horario-btn-delete-all:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* Filas de días */
        .horario-dias-edit-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .horario-dia-edit-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .horario-dia-edit-row.especial {
          background: #fffbeb;
          border-color: #fde68a;
          border-left: 4px solid #f59e0b;
        }

        .horario-dia-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .horario-dia-tag {
          background: #475569;
          color: white;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 800;
          min-width: 70px;
          text-align: center;
        }

        .horario-time-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .horario-time-info {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.82rem;
          color: #334155;
          font-weight: 500;
        }

        .badge-horario-diferente {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          color: #b45309;
          font-weight: 600;
          text-transform: uppercase;
        }

        .horario-dia-actions {
          display: flex;
          gap: 6px;
        }

        .horario-btn-edit-day {
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          border: 1px solid #cbd5e1;
          padding: 5px 12px;
          border-radius: 7px;
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          color: #475569;
          transition: all 0.2s;
        }

        .horario-btn-edit-day:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .horario-btn-remove-day {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 7px 9px;
          border-radius: 7px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .horario-btn-remove-day:hover {
          background: #fecaca;
        }

        /* ── EMPTY STATE ─────────────────────────────────── */
        .horario-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #94a3b8;
          gap: 12px;
        }

        .horario-empty-state h2 {
          font-size: 1.3rem;
          color: #64748b;
          margin: 0;
        }

        .horario-empty-state p {
          font-size: 0.9rem;
          margin: 0;
        }

        /* ── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 640px) {
          .horario-lista-container {
            padding: 12px;
          }
          .lista-detalles-grid {
            grid-template-columns: 1fr 1fr;
          }

          .horario-dia-edit-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .horario-dia-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @media (max-width: 400px) {
          .lista-detalles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
