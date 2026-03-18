"use client";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaClock, FaLock, FaUnlock } from "react-icons/fa";

export default function SolicitudesSubAdmin() {
  const [pendientes, setPendientes] = useState([]);
  const [aprobados, setAprobados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const [resPend, resApro] = await Promise.all([
        fetch("/api/subadmin/aprobar-acceso?estado=pendiente"),
        fetch("/api/subadmin/aprobar-acceso?estado=aprobado"),
      ]);
      const dataPend = await resPend.json();
      const dataApro = await resApro.json();
      setPendientes(dataPend.solicitudes || []);
      setAprobados(dataApro.solicitudes || []);
    } catch {
      setMensaje({ type: "error", text: "Error al cargar solicitudes." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarSolicitudes(); }, []);

  const handleAccion = async (id, accion) => {
    setProcesando(id);
    setMensaje(null);
    try {
      const res = await fetch("/api/subadmin/aprobar-acceso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, accion }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje({ type: "ok", text: data.message });
        cargarSolicitudes();
      } else {
        setMensaje({ type: "error", text: data.message });
      }
    } catch {
      setMensaje({ type: "error", text: "Error al procesar." });
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#1b396a", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          🔐 Solicitudes del Sub Administrador
        </h1>
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          Aprueba, rechaza o revoca el acceso a secciones del sistema.
        </p>
      </div>

      {mensaje && (
        <div style={{
          background: mensaje.type === "ok" ? "#eafaf1" : "#fdecea",
          border: `1px solid ${mensaje.type === "ok" ? "#27ae60" : "#e74c3c"}`,
          color: mensaje.type === "ok" ? "#27ae60" : "#c0392b",
          borderRadius: "10px", padding: "0.75rem 1rem",
          marginBottom: "1rem", fontSize: "0.88rem",
        }}>
          {mensaje.type === "ok" ? "✅" : "⚠️"} {mensaje.text}
        </div>
      )}

      {loading ? (
        <p style={{ color: "#666", textAlign: "center", marginTop: "2rem" }}>Cargando...</p>
      ) : (
        <>
          {/* ── Sección Pendientes ── */}
          <h2 style={{ color: "#1b396a", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            🕐 Pendientes
          </h2>
          {pendientes.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: "14px", border: "1.5px solid #e8eaf0",
              padding: "2rem", textAlign: "center", color: "#999", marginBottom: "2rem",
            }}>
              <FaClock size={28} style={{ marginBottom: "0.5rem", opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No hay solicitudes pendientes.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              {pendientes.map((sol) => (
                <div key={sol.id} style={{
                  background: "#fff", borderRadius: "14px",
                  border: "1.5px solid #e8eaf0", padding: "1.25rem 1.5rem",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(27,57,106,0.06)",
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#1b396a", fontSize: "0.95rem" }}>
                      {sol.subAdminUser}
                    </p>
                    <p style={{ margin: "0.2rem 0 0", color: "#666", fontSize: "0.85rem" }}>
                      Solicita acceso a: <strong>{sol.seccion}</strong>
                    </p>
                    <p style={{ margin: "0.2rem 0 0", color: "#aaa", fontSize: "0.78rem" }}>
                      {new Date(sol.creadoEn).toLocaleString("es-MX")}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleAccion(sol.id, "aprobar")}
                      disabled={procesando === sol.id}
                      style={{
                        background: "#27ae60", color: "#fff", border: "none",
                        borderRadius: "8px", padding: "8px 16px",
                        fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "5px",
                        opacity: procesando === sol.id ? 0.7 : 1,
                      }}
                    >
                      <FaCheck size={12} /> Aprobar
                    </button>
                    <button
                      onClick={() => handleAccion(sol.id, "rechazar")}
                      disabled={procesando === sol.id}
                      style={{
                        background: "#e74c3c", color: "#fff", border: "none",
                        borderRadius: "8px", padding: "8px 16px",
                        fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: "5px",
                        opacity: procesando === sol.id ? 0.7 : 1,
                      }}
                    >
                      <FaTimes size={12} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Sección Aprobados ── */}
          <h2 style={{ color: "#1b396a", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            ✅ Accesos activos
          </h2>
          {aprobados.length === 0 ? (
            <div style={{
              background: "#fff", borderRadius: "14px", border: "1.5px solid #e8eaf0",
              padding: "2rem", textAlign: "center", color: "#999",
            }}>
              <FaUnlock size={28} style={{ marginBottom: "0.5rem", opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No hay accesos aprobados actualmente.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {aprobados.map((sol) => (
                <div key={sol.id} style={{
                  background: "#eafaf1", borderRadius: "14px",
                  border: "1.5px solid #27ae60", padding: "1.25rem 1.5rem",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(39,174,96,0.08)",
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#1b396a", fontSize: "0.95rem" }}>
                      {sol.subAdminUser}
                    </p>
                    <p style={{ margin: "0.2rem 0 0", color: "#27ae60", fontSize: "0.85rem" }}>
                      ✓ Tiene acceso a: <strong>{sol.seccion}</strong>
                    </p>
                    <p style={{ margin: "0.2rem 0 0", color: "#aaa", fontSize: "0.78rem" }}>
                      Aprobado: {new Date(sol.creadoEn).toLocaleString("es-MX")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAccion(sol.id, "bloquear")}
                    disabled={procesando === sol.id}
                    style={{
                      background: "#fff", color: "#e74c3c",
                      border: "1.5px solid #e74c3c",
                      borderRadius: "8px", padding: "8px 16px",
                      fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "5px",
                      opacity: procesando === sol.id ? 0.7 : 1,
                    }}
                  >
                    <FaLock size={12} /> Bloquear acceso
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <button
        onClick={cargarSolicitudes}
        style={{
          marginTop: "1.5rem", background: "none", border: "1.5px solid #1b396a",
          color: "#1b396a", borderRadius: "8px", padding: "8px 20px",
          fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
        }}
      >
        🔄 Actualizar
      </button>
    </div>
  );
}