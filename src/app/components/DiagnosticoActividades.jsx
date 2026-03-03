import React from "react";

export const DiagnosticoActividades = ({
  inscripciones,
  actividadesPersonales,
  allActivities,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        background: "white",
        border: "2px solid #e74c3c",
        borderRadius: 8,
        padding: 20,
        maxWidth: 400,
        maxHeight: 500,
        overflow: "auto",
        zIndex: 9999,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", color: "#e74c3c" }}>🔍 Diagnóstico</h3>

      <div style={{ marginBottom: 15 }}>
        <strong>Inscripciones de API:</strong> {inscripciones.length}
        {inscripciones.length > 0 && (
          <details style={{ marginTop: 5 }}>
            <summary style={{ cursor: "pointer", color: "#3498db" }}>
              Ver detalles
            </summary>
            <pre style={{ fontSize: 10, overflow: "auto", maxHeight: 100 }}>
              {JSON.stringify(inscripciones, null, 2)}
            </pre>
          </details>
        )}
      </div>

      <div style={{ marginBottom: 15 }}>
        <strong>Actividades Personales:</strong> {actividadesPersonales.length}
        {actividadesPersonales.length > 0 && (
          <details style={{ marginTop: 5 }}>
            <summary style={{ cursor: "pointer", color: "#3498db" }}>
              Ver detalles
            </summary>
            <pre style={{ fontSize: 10, overflow: "auto", maxHeight: 100 }}>
              {JSON.stringify(actividadesPersonales, null, 2)}
            </pre>
          </details>
        )}
      </div>

      <div style={{ marginBottom: 15 }}>
        <strong>Actividades Procesadas:</strong> {allActivities.length}
        {allActivities.length > 0 && (
          <details style={{ marginTop: 5 }}>
            <summary style={{ cursor: "pointer", color: "#3498db" }}>
              Ver detalles
            </summary>
            <pre style={{ fontSize: 10, overflow: "auto", maxHeight: 100 }}>
              {JSON.stringify(
                allActivities.map((a) => ({
                  nombre: a.nombre,
                  dia: a.dia,
                  horaInicio: a.horaInicio,
                  horaFin: a.horaFin,
                  tipo: a.tipo,
                })),
                null,
                2,
              )}
            </pre>
          </details>
        )}
      </div>

      <div
        style={{
          padding: 10,
          background: allActivities.length > 0 ? "#d4edda" : "#f8d7da",
          borderRadius: 5,
          color: allActivities.length > 0 ? "#155724" : "#721c24",
        }}
      >
        {allActivities.length > 0
          ? "✅ Hay actividades para mostrar"
          : "❌ No hay actividades procesadas"}
      </div>
    </div>
  );
};
