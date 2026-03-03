import React, { useState } from "react";
import {
  GraduationCap,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Award,
  Hash,
  User,
  Building2,
  Users,
  Calendar,
  BookOpen,
  Star,
  Edit2,
  Trash2,
  AlertTriangle,
  UserX,
} from "lucide-react";

/**
 * MateriasDrawer — Panel lateral completo
 * Muestra inscripciones Y actividades personales con edición
 *
 * Props:
 *   inscripciones        : array de materias inscritas de la API
 *   actividadesPersonales: array de actividades agrupadas (agrupadasParaLista)
 *   onEdit               : (actividad, dia) => void
 *   onDelete             : (nombre) => void
 *   onRemoveDay          : (id, dia) => void
 *   onClose              : () => void
 *   onDarseDeBaja        : (inscripcion) => void
 */
export function MateriasDrawer({
  inscripciones = [],
  actividadesPersonales = [],
  onEdit,
  onDelete,
  onRemoveDay,
  onClose,
  onDarseDeBaja,
}) {
  const [tab, setTab] = useState("inscritas"); // "inscritas" | "personales"
  const [expandida, setExpandida] = useState(null);

  const COLORES = [
    "#1b396a",
    "#2563eb",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];

  const cambiarTab = (t) => {
    setTab(t);
    setExpandida(null);
  };

  return (
    <>
      {/* Overlay */}
      <div className="md-overlay" onClick={onClose} />

      {/* Panel */}
      <aside className="md-panel">
        {/* ── Header ── */}
        <div className="md-header">
          <div className="md-header-left">
            <GraduationCap size={22} color="#1b396a" />
            <h2 className="md-title">Mis Actividades</h2>
          </div>
          <button className="md-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="md-tabs">
          <button
            className={`md-tab ${tab === "inscritas" ? "activa" : ""}`}
            onClick={() => cambiarTab("inscritas")}
          >
            <GraduationCap size={15} />
            Inscritas
            <span className="md-tab-count">{inscripciones.length}</span>
          </button>
          <button
            className={`md-tab ${tab === "personales" ? "activa" : ""}`}
            onClick={() => cambiarTab("personales")}
          >
            <Star size={15} />
            Personales
            <span className="md-tab-count">{actividadesPersonales.length}</span>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="md-body">
          {/* ════ INSCRITAS ════ */}
          {tab === "inscritas" &&
            (inscripciones.length === 0 ? (
              <div className="md-empty">
                <GraduationCap size={48} color="#cbd5e1" />
                <p>No tienes materias inscritas</p>
              </div>
            ) : (
              inscripciones.map((insc, idx) => {
                const act = insc.actividad || insc;
                const horario = act?.horario;
                const docente = insc?.docente || act?.docente;
                const color = COLORES[idx % COLORES.length];
                const abierta = expandida === `i-${idx}`;

                const nombre = act?.aconco || act?.nombre || "Sin nombre";
                const clave = act?.aticve || act?.codigo || "S/C";
                const creditos = act?.acocre || act?.creditos || null;
                const salon =
                  horario?.salon || horario?.aula || act?.salon || act?.aula;
                const grupo = insc?.grupo || act?.grupo || act?.acogru;
                const periodo = insc?.periodo || act?.periodo;
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

                return (
                  <div
                    key={idx}
                    className={`md-card ${abierta ? "abierta" : ""}`}
                    style={{ "--color": color }}
                  >
                    <div
                      className="md-card-header"
                      onClick={() => setExpandida(abierta ? null : `i-${idx}`)}
                    >
                      <div
                        className="md-color-bar"
                        style={{ backgroundColor: color }}
                      />
                      <div className="md-card-info">
                        <div className="md-chips-row">
                          <span className="md-chip clave">{clave}</span>
                          {creditos && (
                            <span className="md-chip creditos">
                              <Award size={11} />
                              {creditos} cr.
                            </span>
                          )}
                          {tipo && <span className="md-chip tipo">{tipo}</span>}
                        </div>
                        <h3 className="md-card-nombre">{nombre}</h3>
                        {horario && (
                          <div className="md-card-mini">
                            <Clock size={12} />
                            <span>
                              {horario.horaInicio} – {horario.horaFin}
                            </span>
                            {diasArray.length > 0 && (
                              <>
                                <span className="md-dot">•</span>
                                <span>{diasArray.join(", ")}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ── Botón baja + toggle ── */}
                      <div className="md-card-header-actions">
                        <button
                          className="md-btn-baja"
                          title="Darme de baja"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDarseDeBaja?.(insc);
                          }}
                        >
                          <UserX size={14} />
                          Baja
                        </button>
                        <button className="md-toggle">
                          {abierta ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {abierta && (
                      <div className="md-card-body">
                        <div className="md-detalles">
                          {docenteNombre && (
                            <div className="md-detalle">
                              <div
                                className="md-detalle-icon"
                                style={{ background: `${color}1a` }}
                              >
                                <User size={14} color={color} />
                              </div>
                              <div>
                                <p className="md-detalle-label">Docente</p>
                                <p className="md-detalle-valor">
                                  {docenteNombre}
                                </p>
                              </div>
                            </div>
                          )}
                          {salon && (
                            <div className="md-detalle">
                              <div
                                className="md-detalle-icon"
                                style={{ background: `${color}1a` }}
                              >
                                <Building2 size={14} color={color} />
                              </div>
                              <div>
                                <p className="md-detalle-label">Salón</p>
                                <p className="md-detalle-valor">{salon}</p>
                              </div>
                            </div>
                          )}
                          {horario && (
                            <div className="md-detalle">
                              <div
                                className="md-detalle-icon"
                                style={{ background: `${color}1a` }}
                              >
                                <Clock size={14} color={color} />
                              </div>
                              <div>
                                <p className="md-detalle-label">Horario</p>
                                <p className="md-detalle-valor">
                                  {horario.horaInicio} – {horario.horaFin}
                                </p>
                                {diasArray.length > 0 && (
                                  <p className="md-detalle-sub">
                                    {diasArray.join(" · ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          {grupo && (
                            <div className="md-detalle">
                              <div
                                className="md-detalle-icon"
                                style={{ background: `${color}1a` }}
                              >
                                <Users size={14} color={color} />
                              </div>
                              <div>
                                <p className="md-detalle-label">Grupo</p>
                                <p className="md-detalle-valor">{grupo}</p>
                              </div>
                            </div>
                          )}
                          {periodo && (
                            <div className="md-detalle">
                              <div
                                className="md-detalle-icon"
                                style={{ background: `${color}1a` }}
                              >
                                <Calendar size={14} color={color} />
                              </div>
                              <div>
                                <p className="md-detalle-label">Periodo</p>
                                <p className="md-detalle-valor">{periodo}</p>
                              </div>
                            </div>
                          )}
                          {clave !== "S/C" && (
                            <div className="md-detalle">
                              <div
                                className="md-detalle-icon"
                                style={{ background: `${color}1a` }}
                              >
                                <Hash size={14} color={color} />
                              </div>
                              <div>
                                <p className="md-detalle-label">Clave</p>
                                <p className="md-detalle-valor">{clave}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {tipo && (
                          <div className="md-tipo-tag">
                            <BookOpen size={12} />
                            {tipo}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ))}

          {/* ════ PERSONALES ════ */}
          {tab === "personales" &&
            (actividadesPersonales.length === 0 ? (
              <div className="md-empty">
                <Star size={48} color="#cbd5e1" />
                <p>No tienes actividades personales</p>
              </div>
            ) : (
              actividadesPersonales.map((activity, idx) => {
                const abierta = expandida === `p-${idx}`;

                return (
                  <div
                    key={activity.id || idx}
                    className={`md-card personal ${abierta ? "abierta" : ""}`}
                    style={{ "--color": activity.color || "#3b82f6" }}
                  >
                    {/* Cabecera */}
                    <div
                      className="md-card-header"
                      onClick={() => setExpandida(abierta ? null : `p-${idx}`)}
                    >
                      <div
                        className="md-color-bar"
                        style={{ backgroundColor: activity.color || "#3b82f6" }}
                      />
                      <div className="md-card-info">
                        <div className="md-chips-row">
                          <span className="md-chip personal-chip">
                            <Star size={10} /> Personal
                          </span>
                          <span className="md-chip clave">
                            {(activity.diasPresentes || [activity.dia]).length}{" "}
                            día(s)
                          </span>
                        </div>
                        <h3 className="md-card-nombre">{activity.nombre}</h3>
                        <div className="md-card-mini">
                          <Clock size={12} />
                          <span>
                            {activity.horaInicio} – {activity.horaFin}
                          </span>
                          <span className="md-dot">•</span>
                          <span>
                            {(activity.diasPresentes || [activity.dia]).join(
                              ", ",
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="md-card-header-actions">
                        <button
                          className="md-btn-danger-icon"
                          title="Eliminar actividad completa"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(activity.nombre);
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                        <button className="md-toggle">
                          {abierta ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Días expandidos con editar */}
                    {abierta && (
                      <div className="md-card-body">
                        <div className="md-dias-list">
                          {(activity.diasPresentes || [activity.dia]).map(
                            (dia, dIdx) => {
                              const hEsp = activity.horariosEspeciales?.[dia];
                              const horaInicio =
                                hEsp?.horaInicio || activity.horaInicio;
                              const horaFin = hEsp?.horaFin || activity.horaFin;

                              return (
                                <div
                                  key={`${activity.id}-${dia}-${dIdx}`}
                                  className={`md-dia-row ${hEsp ? "especial" : ""}`}
                                >
                                  <div className="md-dia-info">
                                    <span
                                      className="md-dia-tag"
                                      style={{
                                        backgroundColor:
                                          activity.color || "#3b82f6",
                                      }}
                                    >
                                      {dia.substring(0, 3).toUpperCase()}
                                    </span>
                                    <div className="md-dia-horario">
                                      <span className="md-dia-tiempo">
                                        <Clock size={13} />
                                        {horaInicio} – {horaFin}
                                      </span>
                                      {hEsp && (
                                        <span className="md-especial-badge">
                                          <AlertTriangle size={11} /> Especial
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="md-dia-actions">
                                    <button
                                      className="md-btn-edit"
                                      title={`Editar horario del ${dia}`}
                                      onClick={() => {
                                        onEdit?.(activity, dia);
                                        onClose();
                                      }}
                                    >
                                      <Edit2 size={13} />
                                      Editar
                                    </button>
                                    <button
                                      className="md-btn-remove"
                                      title={`Quitar ${dia}`}
                                      onClick={() =>
                                        onRemoveDay?.(activity.id, dia)
                                      }
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>

                        {activity.ubicacion && (
                          <div className="md-ubicacion">
                            <Building2 size={13} />
                            <span>{activity.ubicacion}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ))}
        </div>
      </aside>

      <style jsx>{`
        /* ── OVERLAY ── */
        .md-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 200;
          animation: mdFadeIn 0.2s ease;
        }
        @keyframes mdFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ── PANEL ── */
        .md-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100dvh;
          width: 440px;
          max-width: 95vw;
          background: white;
          z-index: 201;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.14);
          animation: mdSlideIn 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes mdSlideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        /* ── HEADER ── */
        .md-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .md-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .md-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }
        .md-close-btn {
          width: 34px;
          height: 34px;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .md-close-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* ── TABS ── */
        .md-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid #f1f5f9;
          flex-shrink: 0;
        }
        .md-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 10px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
        }
        .md-tab:hover {
          color: #475569;
          background: #f8fafc;
        }
        .md-tab.activa {
          color: #1b396a;
          border-bottom-color: #1b396a;
        }
        .md-tab-count {
          background: #f1f5f9;
          color: #64748b;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 10px;
        }
        .md-tab.activa .md-tab-count {
          background: #1b396a;
          color: white;
        }

        /* ── BODY ── */
        .md-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .md-body::-webkit-scrollbar {
          width: 5px;
        }
        .md-body::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .md-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        /* ── EMPTY ── */
        .md-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 0.9rem;
        }

        /* ── CARD ── */
        .md-card {
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: box-shadow 0.2s;
        }
        .md-card:hover {
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }
        .md-card.abierta {
          border-color: var(--color);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
        }

        .md-card-header {
          display: flex;
          align-items: flex-start;
          padding: 13px 12px 13px 0;
          cursor: pointer;
          user-select: none;
        }
        .md-color-bar {
          width: 4px;
          min-height: 44px;
          border-radius: 0 4px 4px 0;
          margin-right: 12px;
          flex-shrink: 0;
          align-self: stretch;
        }
        .md-card-info {
          flex: 1;
          min-width: 0;
        }
        .md-card-header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        /* Chips */
        .md-chips-row {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          margin-bottom: 5px;
        }
        .md-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .md-chip.clave {
          background: #f1f5f9;
          color: #475569;
        }
        .md-chip.creditos {
          background: #fef3c7;
          color: #92400e;
        }
        .md-chip.tipo {
          background: #ede9fe;
          color: #6d28d9;
        }
        .md-chip.personal-chip {
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white;
        }

        .md-card-nombre {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 5px 0;
          line-height: 1.3;
        }
        .md-card-mini {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.73rem;
          color: #64748b;
          flex-wrap: wrap;
        }
        .md-dot {
          color: #cbd5e1;
        }

        /* Botones header */
        .md-toggle {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px 8px;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .md-toggle:hover {
          color: #475569;
        }

        /* ── BOTÓN BAJA (nuevo) ── */
        .md-btn-baja {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .md-btn-baja:hover {
          background: #ef4444;
          color: white;
        }

        .md-btn-danger-icon {
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .md-btn-danger-icon:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ── BODY EXPANDIDO ── */
        .md-card-body {
          padding: 4px 14px 14px 20px;
          animation: mdExpand 0.22s ease;
        }
        @keyframes mdExpand {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .md-detalles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 10px;
        }
        .md-detalle {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .md-detalle-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .md-detalle-label {
          font-size: 0.6rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin: 0 0 2px 0;
        }
        .md-detalle-valor {
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }
        .md-detalle-sub {
          font-size: 0.7rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        .md-tipo-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          color: #475569;
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 6px;
        }

        /* ── DÍAS PERSONALES ── */
        .md-dias-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;
        }
        .md-dia-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          padding: 9px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .md-dia-row.especial {
          background: #fffbeb;
          border-color: #fde68a;
          border-left: 3px solid #f59e0b;
        }
        .md-dia-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .md-dia-tag {
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 5px;
          min-width: 36px;
          text-align: center;
          letter-spacing: 0.5px;
        }
        .md-dia-horario {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .md-dia-tiempo {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
        }
        .md-especial-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.6rem;
          font-weight: 700;
          color: #b45309;
          text-transform: uppercase;
        }
        .md-dia-actions {
          display: flex;
          gap: 5px;
        }
        .md-btn-edit {
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          border: 1px solid #cbd5e1;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }
        .md-btn-edit:hover {
          background: #eff6ff;
          border-color: #2563eb;
          color: #2563eb;
        }
        .md-btn-remove {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .md-btn-remove:hover {
          background: #fecaca;
        }

        .md-ubicacion {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #64748b;
          padding: 6px 10px;
          background: #f8fafc;
          border-radius: 6px;
          margin-top: 4px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .md-panel {
            width: 100vw;
          }
          .md-detalles {
            grid-template-columns: 1fr;
          }
          .md-dia-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .md-dia-actions {
            width: 100%;
            justify-content: flex-end;
          }
          .md-btn-baja span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
