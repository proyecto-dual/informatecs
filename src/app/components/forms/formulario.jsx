"use client";
import React, { useState, useEffect } from "react";

const ActividadForm = ({
  formData = {},
  setFormData,
  handleFormSubmit,
  selectedSport,
  cancelar,
  isSubmitting = false,
  aluctr,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bloodData, setBloodData] = useState({ status: "loading", data: null });

  const steps = [
    "purpose",
    "bloodType",
    "hasCondition",
    "takesMedication",
    "hasAllergy",
    "hasInjury",
    "hasRestriction",
  ];

  useEffect(() => {
    const checkBloodStatus = async () => {
      try {
        const res = await fetch(`/api/sangre?aluctr=${aluctr}`);
        const data = await res.json();
        setBloodData({ status: "ready", data });
        if (data.estudiante?.alutsa) {
          setFormData((prev) => ({
            ...prev,
            bloodType: data.estudiante.alutsa,
          }));
        }
      } catch (err) {
        console.error("Error consultando sangre:", err);
      }
    };
    if (aluctr) checkBloodStatus();
  }, [aluctr, setFormData]);

  const handleToggleQuestion = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [`${field}_toggle`]: value,
      [field]:
        value === "No"
          ? "Ninguna"
          : prev[field] === "Ninguna"
            ? ""
            : prev[field],
    }));
  };

  const handleNext = () => {
    const currentField = steps[currentStep];

    if (currentField === "bloodType") {
      const isAlreadyValidated = bloodData.data?.estudiante?.alutsa;
      if (!isAlreadyValidated) {
        if (!formData.bloodType) return alert("Selecciona tu tipo de sangre.");
        // Validamos que exista el archivo físico, no el base64
        if (!formData.bloodTypeFile)
          return alert("Sube el comprobante en PDF.");
      }
    } else {
      const val = formData[currentField];
      if (!val || val.toString().trim() === "") {
        alert("Por favor selecciona una opción o completa el campo.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const renderMedicalQuestion = (
    stepIndex,
    field,
    label,
    helper,
    placeholder,
  ) => {
    if (currentStep !== stepIndex) return null;
    const isYes = formData[`${field}_toggle`] === "Sí";

    return (
      <div className="animate-fade-in">
        <label style={labelStyle}>{label}</label>
        <div
          style={{
            ...radioContainerStyle,
            flexDirection: "row",
            marginBottom: "1rem",
          }}
        >
          {["No", "Sí"].map((opt) => (
            <label
              key={opt}
              style={{
                ...radioOptionStyle(formData[`${field}_toggle`] === opt),
                flex: 1,
                justifyContent: "center",
              }}
            >
              <input
                type="radio"
                style={{ display: "none" }}
                checked={formData[`${field}_toggle`] === opt}
                onChange={() => handleToggleQuestion(field, opt)}
              />
              {opt}
            </label>
          ))}
        </div>

        {isYes && (
          <div className="animate-fade-in">
            <p style={helperTextStyle}>{helper}</p>
            <textarea
              style={textareaStyle}
              placeholder={placeholder}
              value={formData[field] === "Ninguna" ? "" : formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={headerStyle}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Inscripción: {selectedSport?.name || "Actividad"}
          </h3>
          <button onClick={cancelar} style={closeButtonStyle}>
            ✕
          </button>
        </div>

        <div style={{ padding: "0 1.5rem", marginTop: "1rem" }}>
          <div style={progressBarStyle}>
            <div
              style={{
                ...progressFillStyle,
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          <p style={stepTextStyle}>
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        <div style={{ padding: "1.5rem", minHeight: "320px" }}>
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>
                1. ¿Cuál es el propósito de tu inscripción?
              </label>
              <div style={radioContainerStyle}>
                {["creditos", "servicio_social", "Solamente recreación"].map(
                  (val) => (
                    <label
                      key={val}
                      style={radioOptionStyle(formData.purpose === val)}
                    >
                      <input
                        type="radio"
                        style={{ marginRight: "10px" }}
                        checked={formData.purpose === val}
                        onChange={() =>
                          setFormData({ ...formData, purpose: val })
                        }
                      />
                      {val.replace("_", " ").toUpperCase()}
                    </label>
                  ),
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-fade-in">
              <label style={labelStyle}>2. Información de Tipo de Sangre</label>
              {bloodData.data?.estudiante?.alutsa ? (
                <div style={validatedBoxStyle}>
                  <p>
                    ✅ Sangre validada:{" "}
                    <strong>{bloodData.data.estudiante.alutsa}</strong>
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <select
                    value={formData.bloodType || ""}
                    style={inputStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                  >
                    <option value="">Selecciona tipo de sangre...</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ),
                    )}
                  </select>
                  <div style={{ marginTop: "10px" }}>
                    <p style={{ ...helperTextStyle, marginBottom: "5px" }}>
                      Subir Comprobante (PDF):
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      style={inputStyle}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // GUARDAMOS EL ARCHIVO DIRECTAMENTE, NO EL BASE64
                          setFormData({
                            ...formData,
                            bloodTypeFile: file,
                            bloodTypeFileName: file.name,
                          });
                        }
                      }}
                    />
                    {formData.bloodTypeFileName && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#3b82f6",
                          marginTop: "5px",
                        }}
                      >
                        Archivo seleccionado: {formData.bloodTypeFileName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {renderMedicalQuestion(
            2,
            "hasCondition",
            "3. ¿Padeces alguna enfermedad crónica?",
            "Indica cuál (Asma, Diabetes, etc.):",
            "Describe tu condición...",
          )}
          {renderMedicalQuestion(
            3,
            "takesMedication",
            "4. ¿Tomas algún medicamento actualmente?",
            "Indica nombre y frecuencia:",
            "Nombre del medicamento...",
          )}
          {renderMedicalQuestion(
            4,
            "hasAllergy",
            "5. ¿Eres alérgico a algo?",
            "Medicamentos, alimentos o picaduras:",
            "Describe tus alergias...",
          )}
          {renderMedicalQuestion(
            5,
            "hasInjury",
            "6. ¿Tienes alguna lesión reciente o antigua?",
            "Ejemplo: Fracturas, esguinces o cirugías:",
            "Describe la lesión...",
          )}
          {renderMedicalQuestion(
            6,
            "hasRestriction",
            "7. ¿Tienes alguna restricción física?",
            "Cualquier indicación médica especial:",
            "Describe la restricción...",
          )}
        </div>

        <div style={footerStyle}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              style={backButtonStyle}
            >
              Atrás
            </button>
          )}
          <button
            onClick={
              currentStep < steps.length - 1
                ? handleNext
                : () => handleFormSubmit(formData)
            }
            style={
              currentStep < steps.length - 1
                ? nextButtonStyle
                : submitButtonStyle
            }
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Enviando..."
              : currentStep < steps.length - 1
                ? "Siguiente"
                : "Finalizar Inscripción"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ... (Estilos iguales al original)
const helperTextStyle = {
  fontSize: "0.85rem",
  color: "#6b7280",
  marginBottom: "10px",
};
const textareaStyle = {
  width: "100%",
  minHeight: "100px",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
};
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  maxWidth: "500px",
  width: "100%",
  overflow: "hidden",
};
const headerStyle = {
  padding: "1.25rem",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
};
const closeButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#9ca3af",
};
const progressBarStyle = {
  height: "6px",
  backgroundColor: "#e5e7eb",
  borderRadius: "3px",
};
const progressFillStyle = {
  height: "100%",
  backgroundColor: "#3b82f6",
  transition: "width 0.3s",
};
const stepTextStyle = {
  textAlign: "center",
  marginTop: "8px",
  fontSize: "0.75rem",
  color: "#6b7280",
};
const labelStyle = {
  display: "block",
  marginBottom: "10px",
  fontWeight: 600,
  fontSize: "1rem",
};
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  border: "1px solid #d1d5db",
};
const radioContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};
const radioOptionStyle = (selected) => ({
  display: "flex",
  alignItems: "center",
  padding: "0.75rem",
  border: selected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  cursor: "pointer",
  backgroundColor: selected ? "#eff6ff" : "transparent",
});
const footerStyle = {
  padding: "1.25rem",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};
const backButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#f3f4f6",
  borderRadius: "0.5rem",
  border: "none",
};
const nextButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#3b82f6",
  color: "white",
  borderRadius: "0.5rem",
  border: "none",
};
const submitButtonStyle = {
  padding: "0.6rem 1.2rem",
  backgroundColor: "#10b981",
  color: "white",
  borderRadius: "0.5rem",
  border: "none",
  fontWeight: 600,
};
const validatedBoxStyle = {
  padding: "1rem",
  backgroundColor: "#ecfdf5",
  border: "1px solid #10b981",
  borderRadius: "0.5rem",
  color: "#065f46",
};

export default ActividadForm;
