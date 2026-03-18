"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaLock,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "@/app/components/hooks/authHandlers";
import { useMaestroAuth } from "@/app/components/hooks/useMaestroAuth";
import "@/styles/auth/login.css";

import TeacherForm from "@/app/components/forms/TeacherForm";
import AdminForm from "@/app/components/forms/AdminForm";
// Agrega esta línea junto a los otros imports de forms
import SubAdminForm from "@/app/components/forms/SubAdminForm";
import RegisterForm from "@/app/components/forms/RegisterForm";
import LoginForm from "@/app/components/forms/loginform";
import AskEmailForm from "@/app/components/forms/AskEmailForm";
import VerifyCodeForm from "@/app/components/hooks/VerifyCodeForm";
import UpdatePasswordForm from "@/app/components/forms/UpdatePasswordForm";
import SchoolRainEffect from "@/app/components/animation/SchoolRainEffect";
import MascotCarousel from "@/app/components/ MascotCarousel";
import AdminForgotForm from "@/app/admin-forgot/page";

const LoginPage = () => {
  const router = useRouter();

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
  const [subAdminUser, setSubAdminUser] = useState("");
  const [subAdminPassword, setSubAdminPassword] = useState("");
  const [particles, setParticles] = useState([]);

  const {
    handleLogin,
    handleRegister,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
  } = useAuth(setStep, setFullName, setError, setStudentData);

  const {
    handleMaestroLogin,
    handleMaestroSendCode,
    handleMaestroVerifyCode,
    handleMaestroUpdatePassword,
  } = useMaestroAuth(setStep, setFullName, setError, setMaestroData);

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
    setSubAdminUser("");
    setSubAdminPassword("");
    setEmail("");
    setCode("");
    setNewPassword("");
    setError("");
    setShowPassword(false);
  };

  // ----------------------
  // ESTUDIANTES
  // ----------------------
  const onLoginSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !password)
      return setError("Escribe matrícula y contraseña");
    handleLogin(e, matricula, password);
  };

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    if (!matricula || !email) return setError("Completa todos los campos");
    const expectedEmail = `al${matricula}@ite.edu.mx`.toLowerCase();
    if (email.trim().toLowerCase() !== expectedEmail)
      return setError(`El correo debe ser: al${matricula}@ite.edu.mx`);
    handleRegister(e, matricula, email);
  };

  const onSendCode = (e) => {
    e.preventDefault();
    if (!matricula || !email) return setError("Completa todos los campos");
    const expectedEmail = `al${matricula}@ite.edu.mx`.toLowerCase();
    if (email.trim().toLowerCase() !== expectedEmail)
      return setError(`El correo debe ser: al${matricula}@ite.edu.mx`);
    handleSendCode(e, matricula, email);
  };

  const onVerifyCode = (e) => {
    e.preventDefault();
    if (!code) return setError("Ingresa el código");
    handleVerifyCode(e, matricula, code);
  };

  const onUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword) return setError("Ingresa una contraseña");
    handleUpdatePassword(e, matricula, newPassword);
  };

  // ----------------------
  // MAESTROS
  // ----------------------
  const onTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherId || !password)
      return setError("Escribe ID y contraseña de maestro");
    handleMaestroLogin(e, teacherId, password);
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

  // ----------------------
  // ADMIN
  // ----------------------
  const onAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminUser || !adminPassword)
      return setError("Escribe usuario y contraseña");
    try {
      const res = await fetch("/api/auth/adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUser, password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminName", adminUser);
        router.push("/designs/menuadmin");
      } else {
        setError(data.message || "Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };
  const onSubAdminSubmit = (e) => {
    e.preventDefault();
    if (subAdminUser === "SubAdmin" && subAdminPassword === "admintec2026") {
      localStorage.setItem("subAdminName", "Sub Administrador");
      router.push("/designs/menusubadmin");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };
  // ----------------------
  // Redirecciones
  // ----------------------
  const RedirectAfterLogin = ({ fullName, studentData }) => {
    const internalRouter = useRouter();
    useEffect(() => {
      if (studentData) {
        const cleanedData = {
          nombreCompleto: studentData.nombreCompleto || fullName || "",
          numeroControl: studentData.numeroControl || studentData.aluctr || "",
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
          carrera: studentData.carrera || "Sin carrera asignada",
          carreraId: studentData.carreraId || studentData.carcve || "N/A",
          semestre: studentData.semestre || "No disponible",
          inscripciones: studentData.inscripciones || [],
        };
        localStorage.setItem("studentData", JSON.stringify(cleanedData));
        internalRouter.push(
          `/designs/menuestu?name=${encodeURIComponent(fullName || cleanedData.nombreCompleto)}`,
        );
      }
    }, [internalRouter, fullName, studentData]);
    return null;
  };

  const RedirectAfterMaestroLogin = ({ fullName, maestroData }) => {
    const internalRouter = useRouter();
    useEffect(() => {
      if (maestroData) {
        localStorage.setItem("maestroData", JSON.stringify(maestroData));
        internalRouter.push(
          `/designs/menumaestros?name=${encodeURIComponent(fullName)}`,
        );
      }
    }, [internalRouter, fullName, maestroData]);
    return null;
  };

  // ----------------------
  // FormSteps
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
        onForgotPassword={() => {
          resetForm();
          setStep("askEmail");
        }}
        onRegister={() => {
          resetForm();
          setStep("register");
        }}
      />
    ),
    register: (
      <RegisterForm
        matricula={matricula}
        setMatricula={setMatricula}
        email={email}
        setEmail={setEmail}
        onSubmit={onRegisterSubmit}
      />
    ),
    askEmail: (
      <AskEmailForm
        matricula={matricula}
        setMatricula={setMatricula}
        email={email}
        setEmail={setEmail}
        onSubmit={onSendCode}
      />
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
        onForgotPassword={() => {
          resetForm();
          setStep("askEmailMaestro");
        }}
        onRegister={() => {
          resetForm();
          setStep("teacherRegister");
        }}
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
        onForgotPassword={() => {
          resetForm();
          setStep("admForgot");
        }}
      />
    ),
    // ✅ Paso de recuperación admin
    admForgot: (
      <AdminForgotForm
        onBack={() => {
          resetForm();
          setStep("adm");
        }}
      />
    ),

    // SUB ADMIN
    subadm: (
      <SubAdminForm
        adminUser={subAdminUser}
        setAdminUser={setSubAdminUser}
        adminPassword={subAdminPassword}
        setAdminPassword={setSubAdminPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={onSubAdminSubmit}
      />
    ),
    subadmForgot: (
      <AdminForgotForm
        onBack={() => {
          resetForm();
          setStep("subadm");
        }}
      />
    ),
  };

  const tabs = [
    { id: "login", label: "Estudiantes", icon: <FaUser /> },
    { id: "teacher", label: "Maestros", icon: <FaChalkboardTeacher /> },
    { id: "adm", label: "Admin", icon: <FaLock /> },
    { id: "subadm", label: "SubAdmin", icon: <FaUserShield /> },
  ];

  const showRegisterLink = step === "login" || step === "teacher";
  const showBackToLogin =
    step === "register" ||
    step === "askEmail" ||
    step === "verify" ||
    step === "update";

  return (
    <div className="login-container">
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
          />
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

          {showRegisterLink && (
            <div
              style={{
                textAlign: "center",
                marginTop: "1.25rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <span style={{ fontSize: "0.875rem", color: "#666" }}>
                ¿No tienes cuenta?{" "}
              </span>
              <button
                onClick={() => {
                  resetForm();
                  setStep("register");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1b396a",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                Regístrate aquí
              </button>
            </div>
          )}

          {showBackToLogin && (
            <div
              style={{
                textAlign: "center",
                marginTop: "1.25rem",
                paddingTop: "1rem",
                borderTop: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <button
                onClick={() => {
                  resetForm();
                  setStep("login");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1b396a",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          )}
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
          />
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
