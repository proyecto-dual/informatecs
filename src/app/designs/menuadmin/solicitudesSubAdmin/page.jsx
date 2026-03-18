"use client";
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaClock,
  FaLock,
  FaUnlock,
  FaSync,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import "@/styles/admin/SolicitudesSubAdmin.css";

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

  useEffect(() => {
    cargarSolicitudes();
  }, []);

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
    <div className="solicitudes-wrapper">
      {/* ── Encabezado ── */}
      <div className="solicitudes-header">
        <h1>
          <FaShieldAlt size={18} />
          Solicitudes del Sub Administrador
        </h1>
        <p>Aprueba, rechaza o revoca el acceso a secciones del sistema.</p>
      </div>

      {/* ── Mensaje de estado ── */}
      {mensaje && (
        <div className={`solicitudes-alerta ${mensaje.type}`}>
          {mensaje.type === "ok" ? (
            <FaCheck size={13} />
          ) : (
            <FaExclamationTriangle size={13} />
          )}
          {mensaje.text}
        </div>
      )}

      {/* ── Contenido ── */}
      {loading ? (
        <div className="solicitudes-loading">
          <div className="spinner" />
          <span>Cargando solicitudes...</span>
        </div>
      ) : (
        <>
          {/* ── Pendientes ── */}
          <div className="seccion-bloque">
            <h2 className="seccion-titulo">
              <FaClock size={13} />
              Pendientes
            </h2>

            {pendientes.length === 0 ? (
              <div className="estado-vacio">
                <FaClock size={28} />
                <p>No hay solicitudes pendientes.</p>
              </div>
            ) : (
              <div className="solicitudes-lista">
                {pendientes.map((sol) => (
                  <div key={sol.id} className="solicitud-card">
                    <div className="solicitud-info">
                      <p className="solicitud-usuario">{sol.subAdminUser}</p>
                      <p className="solicitud-seccion">
                        Solicita acceso a: <strong>{sol.seccion}</strong>
                      </p>
                      <p className="solicitud-fecha">
                        {new Date(sol.creadoEn).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <div className="solicitud-acciones">
                      <button
                        className="btn-accion btn-aprobar"
                        onClick={() => handleAccion(sol.id, "aprobar")}
                        disabled={procesando === sol.id}
                      >
                        <FaCheck size={11} /> Aprobar
                      </button>
                      <button
                        className="btn-accion btn-rechazar"
                        onClick={() => handleAccion(sol.id, "rechazar")}
                        disabled={procesando === sol.id}
                      >
                        <FaTimes size={11} /> Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Accesos activos ── */}
          <div className="seccion-bloque">
            <h2 className="seccion-titulo">
              <FaUnlock size={13} />
              Accesos activos
            </h2>

            {aprobados.length === 0 ? (
              <div className="estado-vacio">
                <FaUnlock size={28} />
                <p>No hay accesos aprobados actualmente.</p>
              </div>
            ) : (
              <div className="solicitudes-lista">
                {aprobados.map((sol) => (
                  <div key={sol.id} className="solicitud-card aprobada">
                    <div className="solicitud-info">
                      <p className="solicitud-usuario">{sol.subAdminUser}</p>
                      <p className="solicitud-seccion aprobada">
                        Tiene acceso a: <strong>{sol.seccion}</strong>
                      </p>
                      <p className="solicitud-fecha">
                        Aprobado:{" "}
                        {new Date(sol.creadoEn).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <div className="solicitud-acciones">
                      <button
                        className="btn-accion btn-bloquear"
                        onClick={() => handleAccion(sol.id, "bloquear")}
                        disabled={procesando === sol.id}
                      >
                        <FaLock size={11} /> Bloquear acceso
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Botón actualizar ── */}
      <button className="btn-actualizar" onClick={cargarSolicitudes}>
        <FaSync size={12} /> Actualizar
      </button>
    </div>
  );
}
