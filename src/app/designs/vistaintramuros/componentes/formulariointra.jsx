"use client";
import React, { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import "../estilos/form.css";

const POST_API_URL = "/api/intramuros";

const ModalInscripcion = ({ actividad, onClose, onSuccessfulSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [esExterno, setEsExterno] = useState(false);

  const nombreActividad =
    actividad.Nombre_Actividad || actividad.Actividad || "Actividad";
  const idActividad = actividad.ID_Actividad || "N/A";
  const esActividadGrupal = [
    "fútbol",
    "baloncesto",
    "torneo",
    "copa",
    "vóley",
    "relevos",
    "flag",
    "fubol",
  ].some((p) => nombreActividad.toLowerCase().includes(p));

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    sexo: "",
    telefono: "",
    matricula: "",
    carrera: "",
    comentarios: "",
    nombreEquipo: "",
  });

  const [integrantes, setIntegrantes] = useState([]);
  const [nuevoInt, setNuevoInt] = useState({
    nombre: "",
    correo: "",
    genero: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const agregarIntegrante = (e) => {
    e.preventDefault();
    if (!nuevoInt.nombre || !nuevoInt.correo || !nuevoInt.genero) {
      setError("Completa Nombre, Correo y Género del integrante.");
      return;
    }
    setIntegrantes((prev) => [...prev, { ...nuevoInt }]);
    setNuevoInt({ nombre: "", correo: "", genero: "" });
    setError(null);
  };

  const eliminarIntegrante = (index) => {
    setIntegrantes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (esActividadGrupal && integrantes.length === 0) {
      setError("Agrega al menos un integrante al equipo.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      activityId: idActividad,
      actividad: nombreActividad,
      nombre: formData.nombre,
      email: formData.email,
      sexo: formData.sexo,
      telefono: formData.telefono,
      matricula: esExterno ? "EXTERNO" : formData.matricula,
      carrera: esExterno ? "EXTERNO" : formData.carrera,
      comentarios: formData.comentarios || "Sin obs.",
      nombreEquipo: esActividadGrupal
        ? formData.nombreEquipo || "Equipo"
        : "Individual",
      responsable: formData.nombre,
      nombresIntegrantes: esActividadGrupal
        ? integrantes.map((i) => `${i.nombre} (${i.genero})`).join(", ")
        : "N/A",
      correosIntegrantes: esActividadGrupal
        ? integrantes.map((i) => i.correo).join(", ")
        : "N/A",
    };

    try {
      const response = await fetch(POST_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === "success") {
        onSuccessfulSubmit("¡Inscripción exitosa!");
        onClose();
      } else {
        throw new Error(result.message || "Error al registrar.");
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content animate-in">
        <div className="modal-header">
          <h3>Inscripción: {nombreActividad}</h3>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
            disabled={loading}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div
              className="alert-error"
              style={{
                color: "red",
                background: "#fee2e2",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              {error}
            </div>
          )}

          {/* SWITCH ALUMNO / EXTERNO */}
          <div
            className="toggle-container"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontWeight: !esExterno ? "bold" : "normal",
                color: !esExterno ? "#002855" : "#666",
              }}
            >
              Alumno ITE
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={esExterno}
                onChange={() => setEsExterno(!esExterno)}
                disabled={loading}
              />
              <span className="slider round"></span>
            </label>
            <span
              style={{
                fontWeight: esExterno ? "bold" : "normal",
                color: esExterno ? "#002855" : "#666",
              }}
            >
              Externo
            </span>
          </div>

          <div className="form-grid">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo *"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico *"
              onChange={handleChange}
              required
              disabled={loading}
            />

            <select
              name="sexo"
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Género *</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>

            <input
              type="tel"
              name="telefono"
              placeholder="WhatsApp / Teléfono *"
              onChange={handleChange}
              required
              disabled={loading}
            />

            {/* CAMPOS CONDICIONALES */}
            {!esExterno && (
              <>
                <input
                  type="text"
                  name="matricula"
                  placeholder="Matrícula *"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <input
                  type="text"
                  name="carrera"
                  placeholder="Carrera *"
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </>
            )}

            <input
              type="text"
              name="comentarios"
              placeholder="Observaciones"
              onChange={handleChange}
              disabled={loading}
              className={esExterno ? "full-width" : ""}
            />
          </div>

          {esActividadGrupal && (
            <div className="team-section">
              <div className="section-divider">
                <Users size={16} /> Datos del Equipo
              </div>
              <input
                type="text"
                name="nombreEquipo"
                placeholder="Nombre del Equipo *"
                onChange={handleChange}
                required
                className="full-width"
                disabled={loading}
              />

              <div className="section-divider">Agregar Integrantes</div>
              <div
                className="integrante-input-group"
                style={{ display: "flex", gap: "5px", marginBottom: "10px" }}
              >
                <input
                  type="text"
                  placeholder="Nombre"
                  style={{ flex: 2 }}
                  value={nuevoInt.nombre}
                  onChange={(e) =>
                    setNuevoInt({ ...nuevoInt, nombre: e.target.value })
                  }
                  disabled={loading}
                />
                <input
                  type="email"
                  placeholder="Correo"
                  style={{ flex: 2 }}
                  value={nuevoInt.correo}
                  onChange={(e) =>
                    setNuevoInt({ ...nuevoInt, correo: e.target.value })
                  }
                  disabled={loading}
                />
                <select
                  style={{ flex: 1 }}
                  value={nuevoInt.genero}
                  onChange={(e) =>
                    setNuevoInt({ ...nuevoInt, genero: e.target.value })
                  }
                  disabled={loading}
                >
                  <option value="">Gén.</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
                <button
                  type="button"
                  onClick={agregarIntegrante}
                  className="btn-add"
                  disabled={loading}
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="integrantes-list">
                {integrantes.map((int, i) => (
                  <div
                    key={i}
                    className="integrante-item"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px",
                      background: "#f8f9fa",
                      borderRadius: "6px",
                      marginBottom: "4px",
                      fontSize: "13px",
                    }}
                  >
                    <span>
                      <b>{int.nombre}</b> ({int.genero}) - {int.correo}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarIntegrante(i)}
                      style={{
                        color: "red",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: loading ? "#ccc" : "#002855",
              color: "white",
              borderRadius: "10px",
              marginTop: "20px",
              fontWeight: "bold",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Procesando Registro..." : "Confirmar Inscripción"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalInscripcion;
