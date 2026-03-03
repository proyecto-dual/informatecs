"use client";
import React, { useState, useEffect } from "react";
import "@/styles/admin/InscripcionesPanel.css";

const ModalValidarSangre = ({
  inscripcion,
  onClose,
  onValidar,
  onRechazar,
}) => {
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    setMotivo("");
  }, [inscripcion]);

  if (!inscripcion) return null;
  const { estudiante, tipoSangreSolicitado, comprobanteSangrePDF } =
    inscripcion;

  const handleAprobar = () => {
    if (
      confirm(`¿Confirmas la validación de sangre para ${estudiante.alunom}?`)
    ) {
      // ENVIAMOS "" (VACÍO) PARA BORRAR EL MENSAJE DE RECHAZO PREVIO
      onValidar(inscripcion.id, estudiante.aluctr, "");
      onClose();
    }
  };

  const handleRechazar = () => {
    if (!motivo.trim())
      return alert("Por favor, escribe un motivo de rechazo.");
    onRechazar(estudiante.aluctr, motivo);
    onClose();
  };

  return (
    <div className="ip-sangre-overlay">
      <div className="ip-sangre-modal">
        <div className="ip-sangre-header">
          <div>
            <h3 className="ip-sangre-header-title">
              🩸 Validar Tipo de Sangre
            </h3>
            <p className="ip-sangre-header-sub">Revisa el documento oficial</p>
          </div>
          <button className="ip-sangre-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ip-sangre-body">
          <div className="ip-student-box">
            <p>
              <strong>Alumno:</strong> {estudiante.alunom} {estudiante.aluapp}
            </p>
            <p>
              <strong>Control:</strong> {estudiante.aluctr}
            </p>
            <p className="text-red-600 font-bold">
              <strong>Tipo Declarado:</strong> {tipoSangreSolicitado}
            </p>
          </div>

          <div
            className="ip-comprobante-preview"
            style={{
              height: "320px",
              overflow: "hidden",
              borderRadius: "12px",
              border: "1px solid #ddd",
              marginTop: "15px",
            }}
          >
            {comprobanteSangrePDF?.includes("application/pdf") ? (
              <iframe
                src={comprobanteSangrePDF}
                title="PDF"
                width="100%"
                height="100%"
              />
            ) : (
              <img
                src={comprobanteSangrePDF}
                alt="Comprobante"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </div>

          <div className="ip-rechazo-section" style={{ marginTop: "20px" }}>
            <label className="block font-bold mb-1 text-slate-700">
              Motivo de rechazo (Obligatorio para rechazar):
            </label>
            <textarea
              className="w-full p-3 border-2 rounded-xl focus:border-red-400 outline-none transition-all"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ej: El documento es ilegible o no corresponde al alumno..."
            />
          </div>
        </div>

        <div
          className="ip-sangre-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            padding: "20px",
            borderTop: "1px solid #eee",
          }}
        >
          <button className="ip-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
            onClick={handleRechazar}
            disabled={!motivo.trim()}
          >
            RECHAZAR
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
            onClick={handleAprobar}
          >
            APROBAR Y VALIDAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalValidarSangre;
