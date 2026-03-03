"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaChalkboardTeacher } from "react-icons/fa";
// Importación de Hooks y estilos
import { useAuth } from "@/app/components/hooks/authHandlers";
import { useMaestroAuth } from "@/app/components/hooks/useMaestroAuth";
import "@/styles/auth/login.css";

// Importar formularios (NOTA: Corregir importación de MascotCarousel)
import TeacherForm from "@/app/components/forms/TeacherForm";
import AdminForm from "@/app/components/forms/AdminForm";
import RegisterForm from "@/app/components/forms/RegisterForm";
import LoginForm from "@/app/components/forms/loginform";
import AskEmailForm from "@/app/components/forms/AskEmailForm";
// NOTA: Si VerifyCodeForm es un componente, generalmente no va en /hooks/
import VerifyCodeForm from "@/app/components/hooks/VerifyCodeForm";
import UpdatePasswordForm from "@/app/components/forms/UpdatePasswordForm";
import SchoolRainEffect from "@/app/components/animation/SchoolRainEffect";
import MascotCarousel from "@/app/components/ MascotCarousel";

const LoginPage = () => {
  const router = useRouter();

  // --- Estados generales ---
  const [step, setStep] = useState("login");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [maestroData, setMaestroData] = useState(null);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [particles, setParticles] = useState([]);

  // --- Hooks de autenticación ---
  const {
    handleLogin,
    handleRegister,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
  } = useAuth(setStep, setFullName, setError, setStudentData); // CORRECCIÓN 1: Se agrega setFullName

  const {
    handleMaestroLogin,
    handleMaestroRegister,
    handleMaestroSendCode,
    handleMaestroVerifyCode,
    handleMaestroUpdatePassword,
  } = useMaestroAuth(setStep, setFullName, setError, setMaestroData); // CORRECCIÓN 1: Se agrega setFullName

  useEffect(() => {
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  const resetForm = () => {
    setMatricula("");
    setPassword("");
    setTeacherId("");
    setAdminUser("");
    setAdminPassword("");
    setEmail("");
    setCode("");
    setNewPassword("");
    setError("");
    setShowPassword(false);
  };

  // ----------------------
  // Funciones de envío ESTUDIANTES (se mantiene)
  // ----------------------
  const onLoginSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password)
      return setError("Escribe matrícula y contraseña");
    handleLogin(e, matricula, password);
  };

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password)
      return setError("Escribe matrícula y contraseña");
    if (password !== "123456")
      return setError('La contraseña para registro debe ser "123456"');
    handleRegister(e, matricula, password);
  };

  const onSendCode = (e) => {
    e.preventDefault();
    handleSendCode(e, matricula, email);
  };

  const onVerifyCode = (e) => {
    e.preventDefault();
    handleVerifyCode(e, matricula, code);
  };

  const onUpdatePassword = (e) => {
    e.preventDefault();
    handleUpdatePassword(e, matricula, newPassword);
  };

  // ----------------------
  // Funciones de envío MAESTROS
  // ----------------------
  const onTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherId || !password)
      return setError("Escribe ID y contraseña de maestro");
    handleMaestroLogin(e, teacherId, password);
  };

  const onTeacherRegisterSubmit = (e) => {
    e.preventDefault();
    if (!teacherId || !password) return setError("Escribe ID de maestro");
    if (password !== "profe123")
      return setError('La contraseña para registro debe ser "profe123"');
    handleMaestroRegister(e, teacherId);
  };

  const onMaestroSendCode = (e) => {
    e.preventDefault();
    handleMaestroSendCode(e, teacherId, email);
  };

  const onMaestroVerifyCode = (e) => {
    e.preventDefault();
    handleMaestroVerifyCode(e, teacherId, code);
  };

  const onMaestroUpdatePassword = (e) => {
    e.preventDefault();
    handleMaestroUpdatePassword(e, teacherId, newPassword);
  };

  const onAdminSubmit = (e) => {
    e.preventDefault();
    if (adminUser === "NodalTec" && adminPassword === "eventosadmin2025") {
      // 1. Guardamos el dato en la "mochila" del navegador
      localStorage.setItem("adminName", "Juan Carlos Leal Nodal");

      // 2. Nos vamos al dashboard
      router.push("/designs/menuadmin");
    }
  };
  // ----------------------
  // Componente interno de redirección para estudiantes
  // ----------------------
  const RedirectAfterLogin = ({ fullName, studentData }) => {
    const internalRouter = useRouter();

    useEffect(() => {
      if (studentData) {
        // Mapeo exhaustivo para asegurar que "jalen" los datos nuevos
        const cleanedData = {
          // Datos básicos
          nombreCompleto: studentData.nombreCompleto || fullName || "",
          numeroControl: studentData.numeroControl || studentData.aluctr || "",

          // Información Personal (mapeada de tu esquema Prisma)
          ubicacion: studentData.ubicacion || studentData.aluciu || "",
          fotoUrl: studentData.fotoUrl || studentData.alufac || "",
          fechaNacimiento:
            studentData.fechaNacimiento || studentData.alunac || "",
          rfc: studentData.rfc || studentData.alurfc || "",
          curp: studentData.curp || studentData.alucur || "",
          telefono: studentData.telefono || studentData.alute1 || "",
          email: studentData.email || studentData.alumai || "",
          sexo: studentData.sexo || "",

          sangre: studentData.sangre || studentData.alutsa || "No disponible",
          creditosAprobados:
            studentData.creditosAprobados ||
            studentData.calcac ||
            studentData.aluegr ||
            0,

          // Información Académica
          carrera: studentData.carrera || "Sin carrera asignada",
          carreraId: studentData.carreraId || studentData.carcve || "N/A",
          semestre: studentData.semestre || "No disponible",
          inscripciones: studentData.inscripciones || [],
        };

        // Guardamos en localStorage para que el Dashboard lo lea
        localStorage.setItem("studentData", JSON.stringify(cleanedData));

        //console.log("✅ Datos preparados para el perfil:", cleanedData);

        // Redirección al menú de estudiantes
        internalRouter.push(
          `/designs/menuestu?name=${encodeURIComponent(fullName || cleanedData.nombreCompleto)}`,
        );
      }
    }, [internalRouter, fullName, studentData]);
  };
  const RedirectAfterMaestroLogin = ({ fullName, maestroData }) => {
    const internalRouter = useRouter(); // Usar internalRouter para evitar confusión

    useEffect(() => {
      if (maestroData) {
        localStorage.setItem("maestroData", JSON.stringify(maestroData));
        console.log("✅ Datos del maestro guardados:", maestroData);
        internalRouter.push(
          `/designs/menumaestros?name=${encodeURIComponent(fullName)}`,
        );
      }
    }, [internalRouter, fullName, maestroData]);

    return null;
  };

  // ----------------------
  // Definición de Pasos (FormSteps)
  // ----------------------
  const formSteps = {
    // ESTUDIANTES
    login: (
      <LoginForm
        matricula={matricula}
        setMatricula={setMatricula}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onLoginSubmit}
      />
    ),
    register: (
      <RegisterForm
        matricula={matricula}
        setMatricula={setMatricula}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onRegisterSubmit}
      />
    ),
    // ESTE ES EL PASO QUE SIGUE AL REGISTRO EXITOSO
    askEmail: (
      <AskEmailForm email={email} setEmail={setEmail} onSubmit={onSendCode} />
    ),
    verify: (
      <VerifyCodeForm code={code} setCode={setCode} onSubmit={onVerifyCode} />
    ),

    update: (
      <UpdatePasswordForm
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onSubmit={onUpdatePassword}
      />
    ),

    // Solo se llega aquí DESPUÉS de cambiar la contraseña en 'update'
    success: (
      <RedirectAfterLogin fullName={fullName} studentData={studentData} />
    ),

    // MAESTROS
    teacher: (
      <TeacherForm
        teacherId={teacherId}
        setTeacherId={setTeacherId}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onTeacherSubmit}
      />
    ),
    askEmailMaestro: (
      <AskEmailForm
        email={email}
        setEmail={setEmail}
        onSubmit={onMaestroSendCode}
      />
    ),
    verifyMaestro: (
      <VerifyCodeForm
        code={code}
        setCode={setCode}
        onSubmit={onMaestroVerifyCode}
      />
    ),
    updateMaestro: (
      <UpdatePasswordForm
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        onSubmit={onMaestroUpdatePassword}
      />
    ),
    // CORRECCIÓN 2: Se usa 'fullName'
    successMaestro: (
      <RedirectAfterMaestroLogin
        fullName={fullName}
        maestroData={maestroData}
      />
    ),

    // ADMIN
    adm: (
      <AdminForm
        adminUser={adminUser}
        setAdminUser={setAdminUser}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onAdminSubmit}
      />
    ),

    // CORRECCIÓN 3: Se elimina el paso 'maestroSuccess' duplicado
    // maestroSuccess: <RedirectAfterMaestroLogin maestroData={maestroData} />,
  };

  const tabs = [
    { id: "login", label: "Estudiantes", icon: <FaUser /> },
    { id: "register", label: "Registro", icon: <FaUser /> },
    { id: "teacher", label: "Maestros", icon: <FaChalkboardTeacher /> },
    { id: "adm", label: "Admin", icon: <FaLock /> },
  ];

  return (
    <div className="login-container">
      {/* ... (Contenido del componente se mantiene igual) ... */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          ></div>
        ))}
      </div>

      <div className="form-section">
        <div className="login-header">
          <h1 className="login-title">Eventos ITE</h1>
          <p className="login-subtitle">Sistema de Gestión Académica</p>
        </div>

        <div className="login-card">
          <div className="login-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${
                  step === tab.id ? "tab-active" : "tab-inactive"
                }`}
                onClick={() => {
                  resetForm();
                  setStep(tab.id);
                }}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-container">{formSteps[step]}</div>
        </div>
      </div>

      <div className="wave-divider">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1b396a"
            fillOpacity="1"
            d="M0,160L17.1,176C34.3,192,69,224,103,234.7C137.1,245,171,235,206,218.7C240,203,274,181,309,170.7C342.9,160,377,160,411,181.3C445.7,203,480,245,514,245.3C548.6,245,583,203,617,170.7C651.4,139,686,117,720,128C754.3,139,789,181,823,181.3C857.1,181,891,139,926,138.7C960,139,994,181,1029,202.7C1062.9,224,1097,224,1131,213.3C1165.7,203,1200,181,1234,186.7C1268.6,192,1303,224,1337,240C1371.4,256,1406,256,1423,256L1440,256L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="logo-section">
        <SchoolRainEffect />
        <div className="mascot-container">
          <MascotCarousel />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
