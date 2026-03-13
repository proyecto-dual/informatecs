// src/app/components/hooks/authHandlers.js

export function useAuth(setStep, setFullName, setError, setStudentData) {
  async function handleLogin(e, matricula, password) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setFullName(data.nombre || "Usuario");
        setStudentData(data.estudiante);
        setStep("success");
      } else if (res.status === 403 && data.requiresVerification) {
        setError(
          "Tu cuenta no ha sido verificada. Usa '¿Olvidaste tu contraseña?' para activarla.",
        );
      } else {
        setError(data.message || "Matrícula o contraseña incorrectos");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  // Registro: valida correo institucional y envía código directamente
  async function handleRegister(e, matricula, email) {
    e.preventDefault();
    setError("");

    const expectedEmail = `al${matricula}@ite.edu.mx`.toLowerCase();
    if (email.trim().toLowerCase() !== expectedEmail) {
      setError(`El correo debe ser: al${matricula}@ite.edu.mx`);
      return;
    }

    try {
      const res = await fetch("/api/auth/sendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, correo: email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.message || "No se encontró la matrícula en el sistema");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  }

  // Olvidé contraseña: envía código al correo institucional
  async function handleSendCode(e, matricula, email) {
    e.preventDefault();
    setError("");

    const expectedEmail = `al${matricula}@ite.edu.mx`.toLowerCase();
    if (email.trim().toLowerCase() !== expectedEmail) {
      setError(`El correo debe ser: al${matricula}@ite.edu.mx`);
      return;
    }

    try {
      const res = await fetch("/api/auth/sendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, correo: email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.message || "Error enviando el código");
      }
    } catch {
      setError("Error al enviar el código");
    }
  }

  async function handleVerifyCode(e, matricula, code) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, code }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep("update");
      } else {
        setError(data.message || "Código incorrecto o expirado");
      }
    } catch {
      setError("Error verificando el código");
    }
  }

  async function handleUpdatePassword(e, matricula, newPassword) {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const res = await fetch("/api/auth/changePass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        // Auto-login con la nueva contraseña
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matricula, password: newPassword }),
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
          setFullName(loginData.nombre || "Usuario");
          setStudentData(loginData.estudiante);
          setStep("success");
        } else {
          setError("Contraseña creada. Inicia sesión.");
          setStep("login");
        }
      } else {
        setError(data.message || "Error actualizando la contraseña");
      }
    } catch {
      setError("Error actualizando la contraseña");
    }
  }

  return {
    handleLogin,
    handleRegister,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
  };
}
