import React from "react";
import { Calendar, Clock, Trophy } from "lucide-react";

const SeccionCronologia = ({ resultados }) => {
  if (!resultados || resultados.length === 0) {
    return (
      <div
        className="ap-empty"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <Clock size={40} style={{ opacity: 0.2, marginBottom: "10px" }} />
        <p>No hay resultados registrados en la cronología.</p>
      </div>
    );
  }

  // Función para encontrar columnas sin importar si tienen espacios o guiones bajos
  const getVal = (obj, target) => {
    if (!obj) return "";
    const key = Object.keys(obj).find(
      (k) =>
        k.toLowerCase().replace(/[\s_]/g, "") ===
        target.toLowerCase().replace(/[\s_]/g, ""),
    );
    return key ? obj[key] : "";
  };

  // Agrupar por fecha
  const grupos = resultados.reduce((acc, item) => {
    const fecha = getVal(item, "Fecha") || "Sin Fecha";
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(grupos).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  return (
    <div className="cronologia-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          color: "#1b396a",
        }}
      >
        <Clock size={24} />
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
          Cronología de Resultados
        </h2>
      </div>

      {fechasOrdenadas.map((fecha) => (
        <div key={fecha} style={{ marginBottom: "30px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "2px solid #eee",
              paddingBottom: "5px",
              marginBottom: "15px",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            <Calendar size={16} />
            <span>{fecha}</span>
          </div>

          <div
            style={{
              display: "grid",
              gap: "15px",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {grupos[fecha].map((res, i) => {
              const nombreActividad = getVal(res, "Actividad");
              const local = getVal(res, "Equipo Local");
              const visitante = getVal(res, "Equipo Visitante");
              const marcador = getVal(res, "Marcador");
              const ganador = getVal(res, "Ganador");

              return (
                <div
                  key={i}
                  className="cronologia-card"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "15px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    borderLeft: "5px solid #1b396a",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        color: "#f39c12",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {nombreActividad || "Torneo ITE"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        textAlign: "right",
                        fontWeight: ganador === local ? "800" : "500",
                        color: ganador === local ? "#1b396a" : "#444",
                      }}
                    >
                      {local}
                    </div>

                    <div
                      style={{
                        background: "#1b396a",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "8px",
                        fontWeight: "900",
                        fontSize: "1.1rem",
                        minWidth: "60px",
                        textAlign: "center",
                      }}
                    >
                      {marcador || "0 - 0"}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        fontWeight: ganador === visitante ? "800" : "500",
                        color: ganador === visitante ? "#1b396a" : "#444",
                      }}
                    >
                      {visitante}
                    </div>
                  </div>

                  {ganador && ganador !== "Empate" && (
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "0.8rem",
                        color: "#10b981",
                        fontWeight: "bold",
                        justifyContent: "center",
                      }}
                    >
                      <Trophy size={14} />
                      <span>Ganador: {ganador}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeccionCronologia;
