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
  Home,
  AlertCircle,
} from "lucide-react";
import "@/styles/admin/InscripcionesPanel.css";

// --- SUB-COMPONENTES AUXILIARES ---
const SectionTitle = ({ icon, title }) => (
  <div className="ip-section-header">
    <span className="ip-section-icon">{icon}</span>
    <h4 className="ip-section-title">{title}</h4>
  </div>
);

const DataCard = ({ icon, label, value, valueColor, valueBg, pill }) => (
  <div className="ip-data-card">
    <div className="ip-data-label-container">
      {icon}
      <span className="ip-data-label">{label}</span>
    </div>
    <div
      className={`ip-data-value ${pill ? "ip-pill" : ""}`}
      style={{
        color: valueColor || "inherit",
        backgroundColor: valueBg || "transparent",
      }}
    >
      {value || "No registrado"}
    </div>
  </div>
);

const HealthRow = ({ icon, label, value, isNone }) => (
  <div className={`ip-health-row ${isNone ? "" : "ip-health-alert"}`}>
    <div className="ip-health-info">
      <span className="ip-health-icon">{icon}</span>
      <span className="ip-health-label">{label}</span>
    </div>
    <span className="ip-health-value">{isNone ? "Ninguno" : value}</span>
  </div>
);

const isNone = (val) => {
  if (!val) return true;
  const v = String(val).toLowerCase().trim();
  return ["ninguna", "ninguno", "no", "n/a", "-", "false"].includes(v);
};

const ModalDetalleEstudiante = ({ inscripcion, onClose }) => {
  if (!inscripcion) return null;

  // 1. Extraemos estudiante y formulario
  const e = inscripcion.estudiante || {};
  const form = inscripcion.formularioData || {};

  // 2. Mapeo de datos (Sincronizado con la API restaurada)
  const perfil = {
    numeroControl: e.aluctr || "S/N",
    nombre:
      `${e.alunom || ""} ${e.aluapp || ""} ${e.aluapm || ""}`.trim() ||
      "Nombre no disponible",
    fechaNac: e.alunac || "No disponible",
    rfc: e.alurfc || "No disponible",
    curp: e.alucur || "No disponible",
    telefono: e.alute1 || "No disponible",
    email: e.alumai || "No disponible",
    // Manejo de Género (1: Masc, 2: Fem)
    sexo:
      e.alusex === 1
        ? "Masculino"
        : e.alusex === 2
          ? "Femenino"
          : "No especificado",
    semestre: e.calnpe ? `${e.calnpe}° Semestre` : "No asignado",
    // Accedemos a carnom porque carrera es un objeto en la API
    carrera: e.carrera?.carnom || "Sin carrera asignada",
    ubicacion: e.aluciu || "No disponible",
    nss: e.aluseg || "No registrado",
    foto: e.alufac || "",
  };

  const healthItems = [
    { icon: "🫁", label: "Condición Crónica", value: form.hasCondition },
    { icon: "💊", label: "Medicamentos", value: form.takesMedication },
    { icon: "⚠️", label: "Alergias", value: form.hasAllergy || e.aluale },
    { icon: "🦴", label: "Lesiones", value: form.hasInjury },
    { icon: "🚫", label: "Restricciones", value: form.hasRestriction },
  ];

  return (
    <div className="ip-overlay" onClick={onClose}>
      <div className="ip-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="ip-detail-header">
          <div className="ip-detail-header-left">
            <div className="ip-avatar">
              {perfil.foto ? (
                <img src={perfil.foto} alt="P" className="ip-avatar-img" />
              ) : (
                perfil.nombre[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h3 className="ip-detail-name">{perfil.nombre}</h3>
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
              value={perfil.fechaNac}
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

          <SectionTitle
            icon={<BookOpen size={16} />}
            title="Información Académica"
          />
          <div className="ip-data-grid">
            <DataCard
              icon={<Target size={14} />}
              label="Carrera"
              value={perfil.carrera}
              pill
              valueBg="#eff6ff"
              valueColor="#1d4ed8"
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
              label="Ciudad"
              value={perfil.ubicacion}
            />
          </div>

          <SectionTitle icon={<HeartPulse size={16} />} title="Ficha Médica" />
          <div className="ip-health-list">
            {healthItems.map((item, idx) => (
              <HealthRow
                key={idx}
                icon={item.icon}
                label={item.label}
                value={item.value}
                isNone={isNone(item.value)}
              />
            ))}
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
