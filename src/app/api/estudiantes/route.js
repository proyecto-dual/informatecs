import React from "react";
import {
  Phone,
  Calendar,
  User,
  BookOpen,
  Activity,
  Target,
  X,
  HeartPulse,
  CreditCard,
  MapPin,
  Mail,
  ShieldCheck,
} from "lucide-react";
import "@/styles/admin/InscripcionesPanel.css";

// --- COMPONENTES DE APOYO ---
const SectionTitle = ({ icon, title }) => (
  <div className="ip-section-header">
    <span className="ip-section-icon">{icon}</span>
    <h4 className="ip-section-title">{title}</h4>
  </div>
);

const DataCard = ({ icon, label, value, isAlert }) => (
  <div className="ip-data-card">
    <div className="ip-data-label-container">
      {icon}
      <span className="ip-data-label">{label}</span>
    </div>
    <div className={`ip-data-value ${isAlert ? "text-red-600 font-bold" : ""}`}>
      {value || "No disponible"}
    </div>
  </div>
);

const ModalDetalleEstudiante = ({ inscripcion, onClose }) => {
  if (!inscripcion) return null;

  // 1. EXTRAER DATOS (Siguiendo la estructura de tu API POST)
  const estudiante = inscripcion.estudiante || {};
  const form = inscripcion.formularioData || {};

  // Replicamos la lógica del backend para extraer inscripciones y carrera
  const inscripcionesArray = Array.isArray(estudiante.inscripciones)
    ? estudiante.inscripciones
    : [estudiante.inscripciones].filter(Boolean);

  const primeraInscripcion = inscripcionesArray[0] || {};
  const carreraObj = primeraInscripcion.carrera || {};

  // 2. CONSTRUIR PERFIL (Espejo de perfilCompleto en el API)
  const perfil = {
    numeroControl: estudiante.aluctr || "",
    nombreCompleto:
      `${estudiante.alunom ?? ""} ${estudiante.aluapp ?? ""} ${estudiante.aluapm ?? ""}`.trim(),
    fechaNacimiento: estudiante.alunac || "",
    rfc: estudiante.alurfc || "",
    curp: estudiante.alucur || "",
    telefono: estudiante.alute1 || estudiante.alute2 || "",
    email: estudiante.alumai || "",
    sexo:
      estudiante.alusex === 1
        ? "Masculino"
        : estudiante.alusex === 2
          ? "Femenino"
          : "No especificado",
    semestre: primeraInscripcion.calnpe
      ? primeraInscripcion.calnpe.toString()
      : "No asignado",
    carrera: carreraObj.carnom || "Sin carrera asignada",
    ubicacion: estudiante.aluciu || "",
    fotoUrl: estudiante.alufac || "",
    tipoSangre: estudiante.alutsa || "No disponible", // Extraído del modelo estudiantes
    nss: estudiante.aluseg || "No disponible",
  };

  return (
    <div className="ip-overlay" onClick={onClose}>
      <div className="ip-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="ip-detail-header">
          <div className="ip-detail-header-left">
            <div className="ip-avatar-wrapper">
              {perfil.fotoUrl ? (
                <img
                  src={perfil.fotoUrl}
                  alt="Perfil"
                  className="ip-avatar-img"
                />
              ) : (
                <div className="ip-avatar-initial">
                  {perfil.nombreCompleto[0]}
                </div>
              )}
            </div>
            <div>
              <h3 className="ip-detail-name">{perfil.nombreCompleto}</h3>
              <p className="ip-detail-sub">
                Control: <strong>{perfil.numeroControl}</strong>
              </p>
            </div>
          </div>
          <button className="ip-detail-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="ip-detail-body">
          {/* INFORMACIÓN PERSONAL */}
          <SectionTitle
            icon={<User size={16} />}
            title="Información Personal"
          />
          <div className="ip-data-grid">
            <DataCard
              icon={<Phone size={14} />}
              label="Teléfono"
              value={perfil.telefono}
            />
            <DataCard
              icon={<Mail size={14} />}
              label="Email"
              value={perfil.email}
            />
            <DataCard
              icon={<Calendar size={14} />}
              label="Fecha Nacimiento"
              value={perfil.fechaNacimiento}
            />
            <DataCard
              icon={<User size={14} />}
              label="Sexo"
              value={perfil.sexo}
            />
            <DataCard
              icon={<CreditCard size={14} />}
              label="CURP"
              value={perfil.curp}
            />
            <DataCard
              icon={<CreditCard size={14} />}
              label="RFC"
              value={perfil.rfc}
            />
          </div>

          {/* INFORMACIÓN ACADÉMICA */}
          <SectionTitle
            icon={<BookOpen size={16} />}
            title="Información Académica"
          />
          <div className="ip-data-grid">
            <DataCard
              icon={<Target size={14} />}
              label="Carrera"
              value={perfil.carrera}
            />
            <DataCard
              icon={<Activity size={14} />}
              label="Semestre"
              value={perfil.semestre}
            />
            <DataCard
              icon={<ShieldCheck size={14} />}
              label="NSS"
              value={perfil.nss}
            />
            <DataCard
              icon={<MapPin size={14} />}
              label="Ubicación"
              value={perfil.ubicacion}
            />
          </div>

          {/* INFORMACIÓN MÉDICA (Del formulario JSON) */}
          <SectionTitle icon={<HeartPulse size={16} />} title="Ficha Médica" />
          <div className="ip-health-list">
            <div className="ip-health-item">
              <strong>Tipo de Sangre:</strong> <span>{perfil.tipoSangre}</span>
            </div>
            <div className="ip-health-item">
              <strong>Alergias:</strong>{" "}
              <span>{form.hasAllergy || estudiante.aluale || "Ninguna"}</span>
            </div>
            <div className="ip-health-item">
              <strong>Medicamentos:</strong>{" "}
              <span>{form.takesMedication || "Ninguno"}</span>
            </div>
          </div>
        </div>

        <div className="ip-detail-footer">
          <button className="ip-detail-close-footer" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleEstudiante;
