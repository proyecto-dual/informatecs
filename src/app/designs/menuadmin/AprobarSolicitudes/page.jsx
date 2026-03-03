"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "@/styles/admin/AdminSolicitudes.css";

export default function AdminSolicitudes() {
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [seleccionada, setSeleccionada] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const queryClient = useQueryClient();

  // Limpiar el motivo de rechazo cada vez que se selecciona un alumno diferente
  useEffect(() => {
    setMotivoRechazo("");
  }, [seleccionada]);

  const { data: solicitudes = [], isLoading } = useQuery({
    queryKey: ["inscripciones"],
    queryFn: async () => {
      const res = await fetch("/api/inscripciones");
      if (!res.ok) throw new Error("Error al cargar");
      return res.json();
    },
    refetchInterval: 15000, // Bajamos a 15s para ver cambios más rápido
  });

  const alumnosAgrupados = useMemo(() => {
    const grupos = {};
    solicitudes.forEach((reg) => {
      const id = reg.estudianteId;
      if (!grupos[id]) {
        grupos[id] = { ...reg, todasLasActividades: [] };
      }
      grupos[id].todasLasActividades.push(reg.actividad);
    });
    const lista = Object.values(grupos);
    if (filtroEstado === "pendiente") {
      return lista.filter((a) => a.tipoSangreSolicitado && !a.sangreValidada);
    }
    return lista;
  }, [solicitudes, filtroEstado]);

  const mutation = useMutation({
    mutationFn: async ({ aluctr, accion, actividades }) => {
      // 1. Enviamos la validación de sangre
      const res = await fetch(`/api/sangre`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluctr,
          accion,
          // CLAVE: Si es aprobar, mandamos un string vacío explícito para borrar rechazos previos
          mensaje: accion === "aprobar" ? "" : motivoRechazo,
        }),
      });

      if (!res.ok) throw new Error("Error en la operación de sangre");

      // 2. Si se aprueba, generamos las constancias
      if (accion === "aprobar") {
        await Promise.all(
          actividades.map((act) =>
            fetch("/api/constancias", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                numeroControl: aluctr,
                actividadId: act.id,
                actividadNombre: act.acodes,
                periodo: "2026-1",
              }),
            }),
          ),
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inscripciones"]);
      setSeleccionada(null);
      setMotivoRechazo("");
      alert(
        "✅ ¡Proceso completado! El registro se ha actualizado correctamente.",
      );
    },
    onError: (error) => {
      alert("❌ Error: " + error.message);
    },
  });

  const esPDF =
    seleccionada?.comprobanteSangrePDF?.startsWith("data:application/pdf") ||
    seleccionada?.comprobanteSangrePDF?.endsWith(".pdf");

  return (
    <div className="ssolicitudes-wrapper">
      <div className="ssolicitudes-container">
        {/* HEADER */}
        <header className="ssolicitudes-header">
          <h1 className="ssolicitudes-header-title">
            Validación de Documentos
          </h1>
        </header>

        {/* TABS */}
        <div className="ssolicitudes-tabs">
          {["todas", "pendiente"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`ssolicitudes-tab-btn ${filtroEstado === f ? "ssolicitudes-tab-btn--active" : ""}`}
            >
              {f === "todas" ? "Todas" : "Pendientes"}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="ssolicitudes-grid">
          {/* LISTA */}
          <div className="ssolicitudes-list-col">
            {isLoading && (
              <p className="ssolicitudes-loading">Cargando solicitudes...</p>
            )}

            {!isLoading && alumnosAgrupados.length === 0 && (
              <div className="ssolicitudes-empty">
                No hay solicitudes{" "}
                {filtroEstado === "pendiente" ? "pendientes" : "registradas"}.
              </div>
            )}

            {alumnosAgrupados.map((alumno) => (
              <div
                key={alumno.estudianteId}
                onClick={() => setSeleccionada(alumno)}
                className={`ssolicitudes-alumno-card ${seleccionada?.estudianteId === alumno.estudianteId ? "ssolicitudes-alumno-card--active" : ""}`}
              >
                <div
                  className={`ssolicitudes-alumno-avatar ${seleccionada?.estudianteId === alumno.estudianteId ? "ssolicitudes-alumno-avatar--active" : ""}`}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <div className="ssolicitudes-alumno-info">
                  <h3 className="ssolicitudes-alumno-nombre">
                    {alumno.estudiante?.alunom} {alumno.estudiante?.aluapp}{" "}
                    {alumno.estudiante?.aluapm}
                  </h3>
                  <p className="ssolicitudes-alumno-control">
                    Control: {alumno.estudianteId}
                  </p>
                </div>

                <span
                  className={`ssolicitudes-alumno-badge ${alumno.sangreValidada ? "ssolicitudes-alumno-badge--success" : alumno.tipoSangreSolicitado ? "ssolicitudes-alumno-badge--sangre" : "ssolicitudes-alumno-badge--sd"}`}
                >
                  {alumno.sangreValidada
                    ? "Validado"
                    : (alumno.tipoSangreSolicitado ?? "S/D")}
                </span>
              </div>
            ))}
          </div>

          {/* DETALLE */}
          <div className="ssolicitudes-detail-col">
            {seleccionada ? (
              <div className="ssolicitudes-detail-card">
                <div className="ssolicitudes-detail-header">
                  <div>
                    <h2 className="ssolicitudes-detail-header-title">
                      Revisión de Expediente
                    </h2>
                    <p className="ssolicitudes-detail-header-sub">
                      Alumno: {seleccionada.estudianteId}
                    </p>
                  </div>
                </div>

                <div className="ssolicitudes-detail-body">
                  <div className="ssolicitudes-student-box">
                    <p className="ssolicitudes-student-box-title">
                      Datos del Estudiante
                    </p>
                    <div className="ssolicitudes-student-grid">
                      <div>
                        <span className="ssolicitudes-student-grid-label">
                          Nombre:
                        </span>
                        <p className="ssolicitudes-student-grid-value">
                          {seleccionada.estudiante?.alunom}{" "}
                          {seleccionada.estudiante?.aluapp}
                        </p>
                      </div>
                      <div>
                        <span className="ssolicitudes-student-grid-label">
                          Tipo Declarado:
                        </span>
                        <p className="ssolicitudes-student-grid-value ssolicitudes-student-grid-value--highlight">
                          {seleccionada.tipoSangreSolicitado ||
                            "No especificado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actividades */}
                  <div className="ssolicitudes-actividades-box">
                    <p className="ssolicitudes-actividades-title">
                      Actividades a liberar
                    </p>
                    <ul className="ssolicitudes-actividades-list">
                      {seleccionada.todasLasActividades.map((act, i) => (
                        <li key={i} className="ssolicitudes-actividad-item">
                          {act.acodes}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Comprobante */}
                  <div className="ssolicitudes-comprobante-box">
                    <p className="ssolicitudes-comprobante-title">
                      Comprobante Subido
                    </p>
                    <div className="ssolicitudes-comprobante-preview">
                      {seleccionada.comprobanteSangrePDF ? (
                        esPDF ? (
                          <iframe
                            src={seleccionada.comprobanteSangrePDF}
                            className="ssolicitudes-comprobante-iframe"
                          />
                        ) : (
                          <img
                            src={seleccionada.comprobanteSangrePDF}
                            className="ssolicitudes-comprobante-img"
                            alt="Comprobante"
                          />
                        )
                      ) : (
                        <div className="ssolicitudes-comprobante-empty">
                          Sin comprobante
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivo rechazo */}
                  <div className="ssolicitudes-rechazo-box">
                    <label className="ssolicitudes-label">
                      Motivo (Solo para rechazar):
                    </label>
                    <textarea
                      className="ssolicitudes-rechazo-textarea"
                      placeholder="Ej: El documento es ilegible..."
                      value={motivoRechazo}
                      onChange={(e) => setMotivoRechazo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Footer — acciones */}
                <div className="ssolicitudes-detail-footer">
                  <button
                    className="ssolicitudes-btn-rechazar"
                    disabled={mutation.isPending || !motivoRechazo.trim()}
                    onClick={() =>
                      mutation.mutate({
                        aluctr: seleccionada.estudianteId,
                        accion: "rechazar",
                        actividades: [],
                      })
                    }
                  >
                    Rechazar
                  </button>
                  <button
                    className="ssolicitudes-btn-aprobar"
                    disabled={mutation.isPending}
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Confirmar aprobación? Se borrará cualquier mensaje de error previo.",
                        )
                      ) {
                        mutation.mutate({
                          aluctr: seleccionada.estudianteId,
                          accion: "aprobar",
                          actividades: seleccionada.todasLasActividades,
                        });
                      }
                    }}
                  >
                    {mutation.isPending ? "Procesando..." : "Aprobar y Validar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="ssolicitudes-detail-placeholder">
                <p>Selecciona un alumno para revisar su expediente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
