// app/verificar/[folio]/page.jsx
"use client";
import { useState, useEffect, use } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  FileText,
  Calendar,
  User,
  Award,
} from "lucide-react";

import "./verificar.css"; // ← Agregar esta línea
export default function VerificarConstancia({ params }) {
  const [constancia, setConstancia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedParams = use(params);
  const folio = resolvedParams.folio;

  useEffect(() => {
    verificarConstancia();
  }, [folio]);

  const verificarConstancia = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/constancias?folio=${folio}`);
      const data = await response.json();

      if (response.ok && data.constancia) {
        setConstancia(data.constancia);
      } else {
        setError("Constancia no encontrada o folio inválido");
      }
    } catch (err) {
      console.error("Error al verificar:", err);
      setError("Error al verificar la constancia");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="verify-container">
        <div className="verify-card">
          <div className="spinner-verify"></div>
          <p className="verify-loading-text">Verificando constancia...</p>
        </div>
      </div>
    );
  }

  if (error || !constancia) {
    return (
      <div className="verify-container">
        <div className="verify-card error-card">
          <div className="verify-header-error">
            <XCircle className="error-icon" size={64} />
            <h1 className="verify-title-error">Constancia No Válida</h1>
            <p className="verify-subtitle">
              {error || "No se encontró ninguna constancia con este folio"}
            </p>
          </div>
          <div className="alert-box error-alert">
            <p className="alert-text">
              ⚠️ Esta constancia no existe en nuestros registros o el folio es
              incorrecto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const fechaEmision = new Date(constancia.fechaEmision).toLocaleDateString(
    "es-MX",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="verify-container">
      <div className="verify-card success-card">
        {/* Header de verificación exitosa */}
        <div className="verify-header-success">
          <div className="header-content-success">
            <CheckCircle size={48} className="success-icon" />
            <h1 className="verify-title-success">Constancia Verificada</h1>
          </div>
          <p className="verify-subtitle-success">
            ✓ Este documento es auténtico y está registrado en nuestro sistema
          </p>
        </div>

        {/* Información de la constancia */}
        <div className="verify-content">
          {/* Folio y código */}
          <div className="info-box primary-box">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">
                  <FileText size={18} />
                  Folio Oficial
                </label>
                <p className="info-value-large">{constancia.folio}</p>
              </div>
              <div className="info-item">
                <label className="info-label">
                  <Search size={18} />
                  Código de Verificación
                </label>
                <p className="info-value-code">
                  {constancia.codigoVerificacion}
                </p>
              </div>
            </div>
          </div>

          {/* Datos del estudiante */}
          <div className="section-box">
            <h3 className="section-title">
              <User size={20} />
              Datos del Estudiante
            </h3>
            <div className="section-content">
              <div className="data-row">
                <span className="data-label">Nombre Completo:</span>
                <p className="data-value">{constancia.nombreCompleto}</p>
              </div>
              <div className="data-row">
                <span className="data-label">Número de Control:</span>
                <p className="data-value">{constancia.numeroControl}</p>
              </div>
            </div>
          </div>

          {/* Datos de la actividad */}
          <div className="section-box">
            <h3 className="section-title">
              <Award size={20} />
              Actividad Complementaria
            </h3>
            <div className="section-content">
              <div className="data-row">
                <span className="data-label">Actividad:</span>
                <p className="data-value">{constancia.actividadNombre}</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <p className="stat-label">Código</p>
                  <p className="stat-value">{constancia.actividadCodigo}</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Créditos</p>
                  <p className="stat-value">
                    {constancia.actividadCreditos || "N/A"}
                  </p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Horas</p>
                  <p className="stat-value">
                    {constancia.actividadHoras || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Datos de acreditación */}
          <div className="section-box">
            <h3 className="section-title">
              <Calendar size={20} />
              Información de Acreditación
            </h3>
            <div className="section-content">
              <div className="info-grid-half">
                <div className="data-row">
                  <span className="data-label">Período:</span>
                  <p className="data-value">{constancia.periodo}</p>
                </div>
                <div className="data-row">
                  <span className="data-label">Acreditación:</span>
                  <p className="data-value">{constancia.acreditacion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="metadata-box">
            <p className="metadata-item">
              <strong>Asesoría:</strong> {constancia.asesor}
            </p>
            <p className="metadata-item">
              <strong>Fecha de Emisión:</strong> {fechaEmision}
            </p>
            <p className="metadata-footer">
              Instituto Tecnológico de Ensenada - Departamento de Actividades
              Complementarias
            </p>
          </div>

          {/* Mensaje de seguridad */}
          <div className="alert-box success-alert">
            <p className="alert-text">
              🔒 Este documento ha sido verificado digitalmente. Cualquier
              alteración invalida su autenticidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
