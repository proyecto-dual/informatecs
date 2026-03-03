"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Clock, MapPin, Palette, Calendar } from "lucide-react";

export const ActividadModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  onChange,
  onColorSelect,
  colors,
  dias,
  isEditing,
}) => {
  const [horariosIndividuales, setHorariosIndividuales] = useState({});
  const [modoHorario, setModoHorario] = useState("mismo");
  const [mounted, setMounted] = useState(false);

  // 1. Efecto corregido: Dependencias estables para evitar el error de "changed size"
  useEffect(() => {
    setMounted(true);
    if (show) {
      document.body.style.overflow = "hidden";

      // Verificamos si la actividad viene con horarios por día
      if (isEditing && formData?.horariosEspeciales) {
        setHorariosIndividuales(formData.horariosEspeciales);
        setModoHorario("individual");
      } else {
        setHorariosIndividuales({});
        setModoHorario("mismo");
      }
    } else {
      document.body.style.overflow = "unset";
    }
  }, [show, isEditing, formData]); // Solo dependemos del objeto formData completo

  if (!show || !mounted) return null;

  // 2. Manejo de selección de días con limpieza de horarios
  const handleDiaToggle = (dia) => {
    const currentDias = formData.dias || [];
    const isRemoving = currentDias.includes(dia);
    let newDias;

    if (isRemoving) {
      newDias = currentDias.filter((d) => d !== dia);
      // Limpiar el horario del día eliminado
      const nuevosHorarios = { ...horariosIndividuales };
      delete nuevosHorarios[dia];
      setHorariosIndividuales(nuevosHorarios);
    } else {
      newDias = [...new Set([...currentDias, dia])];
      // Si estamos en modo individual, pre-poblar el nuevo día con el horario base
      if (modoHorario === "individual") {
        setHorariosIndividuales((prev) => ({
          ...prev,
          [dia]: {
            horaInicio: formData.horaInicio || "08:00",
            horaFin: formData.horaFin || "09:00",
          },
        }));
      }
    }
    onChange({ target: { name: "dias", value: newDias } });
  };

  const handleHorarioIndividual = (dia, campo, valor) => {
    setHorariosIndividuales((prev) => ({
      ...prev,
      [dia]: {
        ...(prev[dia] || {
          horaInicio: formData.horaInicio,
          horaFin: formData.horaFin,
        }),
        [campo]: valor,
      },
    }));
  };

  const handleSubmitWithHorarios = (e) => {
    e.preventDefault();
    if (modoHorario === "individual") {
      // Enviamos el objeto de horarios individuales al padre
      onSubmit({
        ...formData,
        horariosEspeciales: horariosIndividuales,
      });
    } else {
      onSubmit({
        ...formData,
        horariosEspeciales: null, // Limpiar especiales si elige "mismo horario"
      });
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className="modal-header"
          style={{ backgroundColor: formData.color || "#3b82f6" }}
        >
          <h2>{isEditing ? "Editar" : "Nueva"} Actividad</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmitWithHorarios} className="modal-body">
          <div className="form-group">
            <label>Nombre de la actividad</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Calendar size={16} /> Días de la semana
            </label>
            <div className="dias-grid">
              {dias.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  className={`dia-btn ${formData.dias?.includes(dia) ? "active" : ""}`}
                  onClick={() => handleDiaToggle(dia)}
                >
                  {dia.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {formData.dias?.length > 0 && (
            <div className="form-group">
              <label>Modo de horario</label>
              <div className="horario-mode-selector">
                <button
                  type="button"
                  className={`mode-btn ${modoHorario === "mismo" ? "active" : ""}`}
                  onClick={() => setModoHorario("mismo")}
                >
                  Mismo horario
                </button>
                <button
                  type="button"
                  className={`mode-btn ${modoHorario === "individual" ? "active" : ""}`}
                  onClick={() => {
                    // Poblar todos los días seleccionados con el horario actual si se cambia a modo individual
                    const init = {};
                    formData.dias.forEach((d) => {
                      init[d] = horariosIndividuales[d] || {
                        horaInicio: formData.horaInicio,
                        horaFin: formData.horaFin,
                      };
                    });
                    setHorariosIndividuales(init);
                    setModoHorario("individual");
                  }}
                >
                  Individual por día
                </button>
              </div>
            </div>
          )}

          {modoHorario === "mismo" ? (
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Clock size={16} /> Inicio
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Clock size={16} /> Fin
                </label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="horarios-individuales">
              <p className="info-text">Configura el horario para cada día:</p>
              {formData.dias?.map((dia) => (
                <div key={dia} className="horario-dia-config">
                  <span className="dia-label-mini">{dia}</span>
                  <div className="horario-inputs">
                    <input
                      type="time"
                      value={
                        horariosIndividuales[dia]?.horaInicio ||
                        formData.horaInicio
                      }
                      onChange={(e) =>
                        handleHorarioIndividual(
                          dia,
                          "horaInicio",
                          e.target.value,
                        )
                      }
                      required
                    />
                    <span className="sep">-</span>
                    <input
                      type="time"
                      value={
                        horariosIndividuales[dia]?.horaFin || formData.horaFin
                      }
                      onChange={(e) =>
                        handleHorarioIndividual(dia, "horaFin", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label>
              <MapPin size={16} /> Ubicación
            </label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={onChange}
              placeholder="Opcional"
            />
          </div>

          <div className="form-group">
            <label>
              <Palette size={16} /> Color
            </label>
            <div className="color-grid">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-btn ${formData.color === c ? "active" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => onColorSelect(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
