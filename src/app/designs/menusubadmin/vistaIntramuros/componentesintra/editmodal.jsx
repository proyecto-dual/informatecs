"use client";
import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import "../css/editmodal.css";

const EditModal = ({ activity, onClose, onSave, WEB_APP_URL }) => {
  const [loading, setLoading] = useState(false);

  // Mapeo defensivo: acepta tanto Nombre_Actividad como Actividad (por si el API devuelve distinto)
  const [formData, setFormData] = useState({
    ID_Actividad: activity?.ID_Actividad || "",
    Nombre_Actividad: activity?.Nombre_Actividad || activity?.Actividad || "",
    Deporte_o_Area: activity?.Deporte_o_Area || activity?.Deporte || "",
    Periodo_Semestre:
      activity?.Periodo_Semestre || activity?.Periodo || "Primavera 2026",
    Fecha_Inicio: activity?.Fecha_Inicio || activity?.Fecha || "",
    Hora_Inicio: activity?.Hora_Inicio || activity?.Hora || "",
    Fecha_Fin: activity?.Fecha_Fin || "",
    Lugar_Sede: activity?.Lugar_Sede || activity?.Lugar || "",
    Estado: activity?.Estado || "Abierto",
    Coordinador: activity?.Coordinador || "",
    Contacto: activity?.Contacto || "",
    Descripción_Detalles:
      activity?.Descripción_Detalles || activity?.Descripcion || "",
    Capacidad_Maxima: activity?.Capacidad_Maxima || activity?.Capacidad || "",
    Max_Integrantes: activity?.Max_Integrantes || "",
  });

  const set = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveActivity", // ← antes decía "update"
          ...formData, // ← antes era data: formData (anidado)
        }),
      });

      const result = await response.json();

      if (response.ok && result.status !== "error") {
        onSave();
        onClose();
      } else {
        alert("Error al guardar: " + (result.message || "Intenta de nuevo"));
      }
    } catch (error) {
      alert("Error de conexión: " + error.message);
    }
    setLoading(false);
  };
  return (
    <div className="em-overlay">
      <div className="em-modal em-modal--wide">
        {/* ── Header ── */}
        <div className="em-modal__header">
          <div>
            <h3 className="em-modal__title">Editar Torneo</h3>
            <p className="em-modal__id">ID: {formData.ID_Actividad}</p>
          </div>
          <button className="em-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="em-modal__body">
          <div className="em-full">
            <label className="em-label">Nombre de la Actividad</label>
            <input
              className="em-input"
              type="text"
              value={formData.Nombre_Actividad}
              onChange={set("Nombre_Actividad")}
            />
          </div>

          <div className="em-grid-2">
            <div>
              <label className="em-label">Deporte / Área</label>
              <input
                className="em-input"
                type="text"
                value={formData.Deporte_o_Area}
                onChange={set("Deporte_o_Area")}
              />
            </div>
            <div>
              <label className="em-label">Periodo / Semestre</label>
              <input
                className="em-input"
                type="text"
                value={formData.Periodo_Semestre}
                onChange={set("Periodo_Semestre")}
              />
            </div>

            <div>
              <label className="em-label">Fecha Inicio</label>
              <input
                className="em-input"
                type="text"
                value={formData.Fecha_Inicio}
                onChange={set("Fecha_Inicio")}
              />
            </div>
            <div>
              <label className="em-label">Hora Inicio</label>
              <input
                className="em-input"
                type="text"
                value={formData.Hora_Inicio}
                onChange={set("Hora_Inicio")}
              />
            </div>

            <div>
              <label className="em-label">Fecha Fin</label>
              <input
                className="em-input"
                type="text"
                value={formData.Fecha_Fin}
                onChange={set("Fecha_Fin")}
              />
            </div>
            <div>
              <label className="em-label">Estado</label>
              <select
                className="em-select"
                value={formData.Estado}
                onChange={set("Estado")}
              >
                <option value="Abierto">Abierto</option>
                <option value="Cerrado">Cerrado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="em-full">
            <label className="em-label">Lugar / Sede</label>
            <input
              className="em-input"
              type="text"
              value={formData.Lugar_Sede}
              onChange={set("Lugar_Sede")}
            />
          </div>

          <div className="em-grid-2">
            <div>
              <label className="em-label">Coordinador</label>
              <input
                className="em-input"
                type="text"
                value={formData.Coordinador}
                onChange={set("Coordinador")}
              />
            </div>
            <div>
              <label className="em-label">Contacto</label>
              <input
                className="em-input"
                type="text"
                value={formData.Contacto}
                onChange={set("Contacto")}
              />
            </div>

            <div>
              <label className="em-label">Capacidad Máx. Equipos</label>
              <input
                className="em-input"
                type="number"
                value={formData.Capacidad_Maxima}
                onChange={set("Capacidad_Maxima")}
              />
            </div>
            <div>
              <label className="em-label">Máx. Integrantes p/e</label>
              <input
                className="em-input"
                type="number"
                value={formData.Max_Integrantes}
                onChange={set("Max_Integrantes")}
              />
            </div>
          </div>

          <div className="em-full">
            <label className="em-label">Descripción / Detalles</label>
            <textarea
              className="em-textarea"
              value={formData.Descripción_Detalles}
              onChange={set("Descripción_Detalles")}
            />
          </div>

          <div className="em-banner em-full">
            <AlertCircle className="em-banner__icon" size={18} />
            <p className="em-banner__text">
              Los cambios tardan ~2 segundos en guardarse en Google Sheets.
            </p>
          </div>

          <div className="em-btn-row em-full">
            <button type="button" className="em-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="em-btn-save" disabled={loading}>
              {loading ? <span className="em-spinner" /> : <Save size={16} />}
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
