"use client";
import React, { Fragment, useState, useEffect } from "react";
import { Clock, Edit2, Trash2, MapPin } from "lucide-react";

export const CalendarioView = ({
  diasSemana,
  horasVisibles,
  primeraHora,
  getActivityForSlot,
  getActivitySpan,
  onEdit,
  onDelete,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const getStartRow = (horaInicio) => {
    if (!horaInicio) return 2;
    const [h] = horaInicio.split(":").map(Number);
    return h - primeraHora + 2;
  };

  // --- VISTA MÓVIL (Mantiene la coherencia de tus colores de actividad) ---
  if (isMobile) {
    return (
      <div className="mobile-container" style={{ padding: "10px" }}>
        {diasSemana.map((dia) => {
          const actividadesDia = [];
          const vistos = new Set();
          horasVisibles.forEach((h) => {
            const act = getActivityForSlot(dia, h);
            if (act && !vistos.has(act.id)) {
              actividadesDia.push(act);
              vistos.add(act.id);
            }
          });

          if (actividadesDia.length === 0) return null;

          return (
            <div key={dia} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontWeight: "800",
                  color: "#1b396a",
                  borderBottom: "2px solid #fe9e10",
                  marginBottom: "10px",
                  paddingBottom: "5px",
                }}
              >
                {dia.toUpperCase()}
              </div>
              {actividadesDia.map((act) => (
                <div
                  key={act.id}
                  style={{
                    backgroundColor: act.color || "#3b82f6",
                    borderRadius: "6px",
                    padding: "12px",
                    color: "white",
                    marginBottom: "8px",
                    position: "relative",
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>
                    {act.nombre}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      display: "flex",
                      gap: "10px",
                      marginTop: "4px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <Clock size={12} /> {act.horaInicio}
                    </span>
                    {act.aula && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <MapPin size={12} /> {act.aula}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // --- VISTA COMPUTADORA (TU CÓDIGO ORIGINAL EXACTO) ---
  return (
    <div className="calendario-container" style={{ overflowX: "auto" }}>
      <div
        className="calendario-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `80px repeat(${diasSemana.length}, 1fr)`,
          gridTemplateRows: `50px repeat(${horasVisibles.length}, 60px)`,
          gap: "0",
          position: "relative",
          minWidth: "1000px", // Asegura que en Tablets no se colapsen las columnas
        }}
      >
        {/* Cabecera Hora */}
        <div className="header-hora" style={{ gridColumn: "1", gridRow: "1" }}>
          Hora
        </div>

        {/* Cabecera Días */}
        {diasSemana.map((dia, idx) => (
          <div
            key={dia}
            className="header-dia"
            style={{ gridColumn: idx + 2, gridRow: "1" }}
          >
            {dia}
          </div>
        ))}

        {/* Eje Y: Horas */}
        {horasVisibles.map((hora, idx) => (
          <div
            key={hora}
            className="columna-hora"
            style={{ gridColumn: "1", gridRow: idx + 2 }}
          >
            {`${hora}:00`}
          </div>
        ))}

        {/* Celdas de fondo - RESTAURADO: border 1px solid #e5e7eb */}
        {diasSemana.map((dia, diaIdx) => (
          <Fragment key={`bg-${dia}`}>
            {horasVisibles.map((hora, horaIdx) => (
              <div
                key={`${dia}-${hora}`}
                className="celda-fondo"
                style={{
                  gridColumn: diaIdx + 2,
                  gridRow: horaIdx + 2,
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                }}
              />
            ))}
          </Fragment>
        ))}

        {/* Actividades - RESTAURADO: Estilos originales de padding, margin y texto */}
        {diasSemana.map((dia, diaIdx) => {
          const colIndex = diaIdx + 2;
          return (
            <Fragment key={`activities-${dia}`}>
              {horasVisibles.map((hora) => {
                const activity = getActivityForSlot(dia, hora);

                if (activity) {
                  const span = getActivitySpan(activity);
                  const startRow = getStartRow(activity.horaInicio);

                  return (
                    <div
                      key={activity.id}
                      className={`actividad ${activity.tipo}`}
                      style={{
                        gridRow: `${startRow} / span ${span}`,
                        gridColumn: colIndex,
                        backgroundColor: activity.color || "#3b82f6",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        padding: "8px",
                        margin: "2px",
                        position: "relative",
                        zIndex: 10,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="actividad-contenido">
                        <div
                          className="actividad-nombre"
                          style={{
                            color: "white",
                            fontWeight: "700",
                            fontSize: "0.85rem",
                            marginBottom: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {activity.nombre}
                        </div>

                        {activity.aula && (
                          <div
                            className="actividad-aula"
                            style={{
                              color: "rgba(255,255,255,0.95)",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              marginBottom: "2px",
                            }}
                          >
                            <MapPin size={10} />
                            <span>{activity.aula}</span>
                          </div>
                        )}

                        <div
                          className="actividad-tiempo"
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "0.7rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Clock size={10} />
                          {activity.horaInicio} - {activity.horaFin}
                        </div>
                      </div>

                      {activity.tipo === "personal" && (
                        <div
                          className="actividad-acciones"
                          style={{
                            display: "flex",
                            gap: "4px",
                            marginTop: "6px",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(activity);
                            }}
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 6px",
                              cursor: "pointer",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Edit2 size={11} strokeWidth={3} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(activity.id);
                            }}
                            style={{
                              background: "rgba(255,255,255,0.2)",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 6px",
                              cursor: "pointer",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
