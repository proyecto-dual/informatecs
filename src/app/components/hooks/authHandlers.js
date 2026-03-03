// src/components/hooks/useAuthHandlers.js
import { useRouter } from "next/navigation";

export function useAuth(setStep, setFullName, setError, setStudentData) {
  const router = useRouter();

  // ========================================
  // LOGIN (Pestaña Estudiantes)
  // ========================================
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
        // No se permite el acceso si no está verificado
        setError(
          "Tu cuenta no ha sido verificada. Usa la pestaña 'Registro' para verificarla.",
        );
      } else {
        setError(data.message || "Error desconocido");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      setError("Error al conectar con el servidor");
    }
  }

  // ========================================
  // REGISTRO (Pestaña Registro)
  // ========================================
  // src/components/hooks/useAuthHandlers.js

  async function handleRegister(e, matricula) {
    e.preventDefault();
    setError("");
    try {
      // ⚠️ Importante: Asegúrate de que el endpoint sea el de login
      // porque estamos validando si puede entrar con la genérica
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, password: "123456" }),
      });

      const data = await res.json();

      // 1. Caso: El servidor confirma que requiere verificar (403 o 200)
      if (data.requiresVerification || res.status === 403) {
        setStep("askEmail");
        return;
      }

      // 2. Caso: El login fue exitoso con 123456 pero NO activó requiresVerification
      // Forzamos el cambio de contraseña de todos modos por seguridad
      if (res.ok) {
        setStep("askEmail");
        return;
      }

      // 3. Caso: Error (ej. la matrícula no existe en la base de datos)
      setError(
        data.message || "La matrícula no es válida para registro inicial.",
      );
    } catch (error) {
      console.error("❌ Error en registro:", error);
      setError("Error al conectar con el servidor");
    }
  }

  // ========================================
  // ENVIAR CÓDIGO
  // ========================================
  async function handleSendCode(e, matricula, email) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/sendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, correo: email }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("✅ Código enviado");
        setStep("verify");
      } else {
        setError(data.message || "Error enviando el código");
      }
    } catch (error) {
      console.error("❌ Error enviando código:", error);
      setError("Error al enviar el código");
    }
  }

  // ========================================
  // VERIFICAR CÓDIGO
  // ========================================
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
        console.log("✅ Código verificado");
        setStep("update");
      } else {
        setError(data.message || "Código incorrecto");
      }
    } catch (error) {
      console.error("❌ Error verificando código:", error);
      setError("Error verificando el código");
    }
  }

  // ========================================
  // ACTUALIZAR CONTRASEÑA
  // ========================================
  async function handleUpdatePassword(e, matricula, newPassword) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/changePass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matricula, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("✅ Contraseña actualizada, haciendo login...");

        // Hacer login automáticamente con la nueva contraseña
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
          setError(
            "Contraseña actualizada. Inicia sesión en la pestaña 'Estudiantes'.",
          );
        }
      } else {
        setError(data.message || "Error actualizando la contraseña");
      }
    } catch (error) {
      console.error("❌ Error actualizando contraseña:", error);
      setError("Error actualizando la contraseña");
    }
  }

  return {
    handleLogin,
    handleSendCode,
    handleVerifyCode,
    handleUpdatePassword,
    handleRegister,
  };
}
