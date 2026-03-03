"use client";
import { useEffect, useState, useCallback } from "react";
import NavbarEst from "@/app/components/layout/navbares";
import "@/styles/alumno/perfil.css";

const initialStudentData = {
  nombreCompleto: "",
  numeroControl: "",
  ubicacion: "",
  fotoUrl: "",
  fechaNacimiento: "",
  rfc: "",
  curp: "",
  telefono: "",
  email: "",
  sexo: "",
  sangre: "",
  creditosAprobados: 0,
  carrera: "",
  carreraId: "",
  semestre: "",
  inscripciones: [],
};

export default function DashboardPage() {
  const [studentData, setStudentData] = useState(initialStudentData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("studentData");

      if (!savedData) {
        console.warn("Esperando datos de localStorage...");
        return;
      }

      const parsed = JSON.parse(savedData);
      const firstInscripcion = parsed.inscripciones?.[0] || {};
      const carreraObj = firstInscripcion.carrera || {};

      const merged = {
        ...initialStudentData,
        ...parsed,
        sangre: parsed.alutsa || parsed.sangre || "No disponible",
        carrera: carreraObj.carnom || "Sin carrera asignada",
        carreraId: carreraObj.carcve?.toString() || "N/A",
        semestre: firstInscripcion.calnpe || "No disponible",
        telefono: parsed.alute1 || parsed.telefono || "No disponible",
        creditosAprobados: parsed.calcac ?? parsed.creditosAprobados ?? 0,
        sexo:
          parsed.alusex === 1
            ? "Masculino"
            : parsed.alusex === 2
              ? "Femenino"
              : parsed.sexo || "No disponible",
      };

      setStudentData(merged);
      setError(null);
    } catch (err) {
      console.error("❌ Error al procesar datos:", err);
      setError("Error al procesar la información del estudiante.");
    } finally {
      // Delay para asegurar que el CSS esté listo
      setTimeout(() => setLoading(false), 200);
    }
  }, []);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "studentData") fetchStudentData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchStudentData]);

  // Componente interno con clases corregidas
  const InfoCard = ({ icon, title, items }) => (
    <div className="perfil-info-card">
      <div className="perfil-card-header">
        <div className="perfil-card-icon-box">{icon}</div>
        <h2 className="perfil-card-title">{title}</h2>
      </div>
      <div className="perfil-card-content">
        {items.map((item, index) => (
          <div key={index} className="perfil-data-row">
            <span className="perfil-data-label">{item.label}</span>
            <span className="perfil-data-value">
              {item.value || "No disponible"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="perfil-main-page-container">
      {loading ? (
        <div className="perfil-centered">
          <div className="perfil-spinner"></div>
          <p
            style={{
              marginTop: "15px",
              color: "var(--blue-primary)",
              fontWeight: "600",
            }}
          >
            Cargando información académica...
          </p>
        </div>
      ) : (
        <div className="perfil-portfolio-wrapper">
          <header className="perfil-welcome-section">
            <div className="perfil-welcome-grid">
              <div className="perfil-profile-img-container">
                <img
                  src={studentData.fotoUrl || "/imagenes/logoelegantee.png"}
                  className="perfil-profile-main-img"
                  alt="Foto"
                  width="180"
                  height="180"
                  loading="eager"
                  style={{
                    aspectRatio: "1/1",
                    objectFit: "cover",
                    width: "180px",
                    height: "180px",
                  }}
                  onError={(e) => {
                    e.target.src = "/imagenes/logoelegantee.png";
                  }}
                />
              </div>
              <div className="perfil-welcome-text-content">
                <h1 className="perfil-welcome-title">
                  ¡Bienvenido,{" "}
                  {studentData.nombreCompleto
                    ? studentData.nombreCompleto.split(" ")[0]
                    : "Estudiante"}
                  !
                </h1>
                <p className="perfil-welcome-description">
                  Esta es tu ficha de identidad académica. Por favor, verifica
                  que tu información personal y escolar coincida con tus
                  documentos oficiales.
                </p>
              </div>
            </div>
          </header>

          <main className="perfil-info-grid">
            <InfoCard
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              title="Información Personal"
              items={[
                { label: "Nombre Completo", value: studentData.nombreCompleto },
                {
                  label: "Fecha de Nacimiento",
                  value: studentData.fechaNacimiento,
                },
                { label: "Tipo de Sangre", value: studentData.sangre },
                { label: "RFC", value: studentData.rfc },
                { label: "CURP", value: studentData.curp },
                { label: "Sexo", value: studentData.sexo },
                { label: "Teléfono", value: studentData.telefono },
                {
                  label: "Email",
                  value: studentData.email || studentData.alumai,
                },
              ]}
            />

            <InfoCard
              icon={
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              }
              title="Información Académica"
              items={[
                { label: "Carrera", value: studentData.carrera },
                { label: "Clave de Carrera", value: studentData.carreraId },
                {
                  label: "Matrícula / Control",
                  value: studentData.numeroControl,
                },
                { label: "Semestre Actual", value: studentData.semestre },
                {
                  label: "Créditos Aprobados",
                  value: studentData.creditosAprobados,
                },
              ]}
            />
          </main>
        </div>
      )}
    </div>
  );
}
