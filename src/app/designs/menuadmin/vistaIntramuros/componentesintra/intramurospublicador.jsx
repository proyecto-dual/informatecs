"use client";
import React, { useState, useEffect } from "react";
import { Send, Loader2, ListPlus, X } from "lucide-react";
import "../css/adminpublicador.css";

const WEB_APP_URL = "/api/intramuros";

const AdminPublicador = ({ onFinish, onCancel, siguienteID }) => {
  const [enviando, setEnviando] = useState(false);

  const [form, setForm] = useState({
    ID_Actividad: siguienteID || "",
    Nombre_Actividad: "",
    Deporte_o_Area: "",
    Periodo_Semestre: "Primavera 2026",
    Fecha_Inicio: "",
    Hora_Inicio: "",
    Fecha_Fin: "",
    Lugar_Sede: "",
    Estado: "Abierto",
    Coordinador: "",
    Contacto: "",
    Descripción_Detalles: "",
    Capacidad_Maxima: "10",
    Max_Integrantes: "6",
    Categoria_Genero: "Mixto",
  });

  useEffect(() => {
    if (siguienteID)
      setForm((prev) => ({ ...prev, ID_Actividad: siguienteID }));
  }, [siguienteID]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setEnviando(true);
    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ action: "saveActivity", ...form }),
      });
      setTimeout(() => {
        setEnviando(false);
        if (onFinish) onFinish();
      }, 1500);
    } catch {
      setEnviando(false);
      alert("Error al guardar la actividad.");
    }
  };

  const field = (label, children, full = false) => (
    <div className={full ? "ap-full" : ""}>
      <label className="ap-label">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="ap-overlay">
      <div className="ap-modal">
        {/* ── Header ── */}
        <div className="ap-modal__header">
          <div className="ap-modal__icon">
            <ListPlus size={22} color="#fff" />
          </div>
          <div className="ap-modal__info">
            <h2 className="ap-modal__title">Configurar Actividad</h2>
            <p className="ap-modal__id">ID DE REGISTRO: {form.ID_Actividad}</p>
          </div>
          <button className="ap-modal__close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="ap-modal__body">
          <div className="ap-form-grid">
            {field(
              "Nombre de la Actividad *",
              <input
                className="ap-input"
                type="text"
                required
                placeholder="Ej. Torneo Relámpago Voleibol"
                value={form.Nombre_Actividad}
                onChange={(e) =>
                  setForm({ ...form, Nombre_Actividad: e.target.value })
                }
              />,
              true,
            )}

            {field(
              "Deporte o Área",
              <input
                className="ap-input"
                type="text"
                placeholder="Ej. Deportes"
                value={form.Deporte_o_Area}
                onChange={(e) =>
                  setForm({ ...form, Deporte_o_Area: e.target.value })
                }
              />,
            )}

            {field(
              "Categoría de Género",
              <select
                className="ap-select"
                value={form.Categoria_Genero}
                onChange={(e) =>
                  setForm({ ...form, Categoria_Genero: e.target.value })
                }
              >
                <option value="Mixto">Mixto</option>
                <option value="Varonil">Varonil</option>
                <option value="Femenil">Femenil</option>
              </select>,
            )}

            {field(
              "Fecha Inicio",
              <input
                className="ap-input"
                type="date"
                required
                value={form.Fecha_Inicio}
                onChange={(e) =>
                  setForm({ ...form, Fecha_Inicio: e.target.value })
                }
              />,
            )}

            {field(
              "Fecha Finalización",
              <input
                className="ap-input"
                type="date"
                value={form.Fecha_Fin}
                onChange={(e) =>
                  setForm({ ...form, Fecha_Fin: e.target.value })
                }
              />,
            )}

            {field(
              "Hora de Encuentro",
              <input
                className="ap-input"
                type="time"
                value={form.Hora_Inicio}
                onChange={(e) =>
                  setForm({ ...form, Hora_Inicio: e.target.value })
                }
              />,
            )}

            {field(
              "Capacidad de Equipos",
              <input
                className="ap-input"
                type="number"
                value={form.Capacidad_Maxima}
                onChange={(e) =>
                  setForm({ ...form, Capacidad_Maxima: e.target.value })
                }
              />,
            )}

            {field(
              "Lugar / Sede",
              <input
                className="ap-input"
                type="text"
                placeholder="Ej. Cancha de Usos Múltiples"
                value={form.Lugar_Sede}
                onChange={(e) =>
                  setForm({ ...form, Lugar_Sede: e.target.value })
                }
              />,
              true,
            )}

            {field(
              "Coordinador Responsable",
              <input
                className="ap-input"
                type="text"
                placeholder="Nombre completo"
                value={form.Coordinador}
                onChange={(e) =>
                  setForm({ ...form, Coordinador: e.target.value })
                }
              />,
            )}

            {field(
              "Contacto (WhatsApp/Tel)",
              <input
                className="ap-input"
                type="text"
                placeholder="Ej. 646 123 4567"
                value={form.Contacto}
                onChange={(e) => setForm({ ...form, Contacto: e.target.value })}
              />,
            )}

            {field(
              "Máx. Integrantes p/e",
              <input
                className="ap-input"
                type="number"
                value={form.Max_Integrantes}
                onChange={(e) =>
                  setForm({ ...form, Max_Integrantes: e.target.value })
                }
              />,
            )}

            {field(
              "Estado de Inscripción",
              <select
                className="ap-select"
                value={form.Estado}
                onChange={(e) => setForm({ ...form, Estado: e.target.value })}
              >
                <option value="Abierto">Abierto (Público)</option>
                <option value="Cerrado">Cerrado (Oculto)</option>
              </select>,
            )}

            {field(
              "Descripción y Requisitos",
              <textarea
                className="ap-textarea"
                placeholder="Indica si deben traer uniforme, credencial, etc."
                value={form.Descripción_Detalles}
                onChange={(e) =>
                  setForm({ ...form, Descripción_Detalles: e.target.value })
                }
              />,
              true,
            )}
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="ap-modal__footer">
          <button
            className="ap-btn-submit"
            disabled={enviando}
            onClick={handleSubmit}
          >
            {enviando ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <Send size={18} />
            )}
            {enviando ? "Publicando..." : "Publicar Actividad"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPublicador;
