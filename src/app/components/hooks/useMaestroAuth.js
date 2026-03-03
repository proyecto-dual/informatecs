import { useRouter } from "next/navigation";

export function useMaestroAuth(setStep, setFullName, setError, setMaestroData) {
  const router = useRouter();

  async function handleMaestroLogin(e, percve, password) {
    setError("");
    try {
      const res = await fetch("/api/auth/maestros/iniciarSesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percve, password }),
      });

      const data = await res.json();
      console.log("📥 Respuesta del servidor:", data);

      // ✅ Login exitoso (cuenta ya verificada)
      if (res.ok && res.status === 200) {
        setFullName(data.nombre || "Maestro");
        setMaestroData(data.maestro);
        setStep("successMaestro");
        return;
      }

      // ⚠️ Cuenta no verificada (403) - continuar con registro
      if (res.status === 403 && data.requiresVerification) {
        console.log("⚠️ Redirigiendo a verificación...");
        setStep("askEmailMaestro");
        return;
      }

      // ❌ Cualquier otro error
      setError(data.message || "Error en el inicio de sesión");
    } catch (error) {
      console.error("❌ Error de red:", error);
      setError("Error al conectar con el servidor");
    }
  }

  async function handleMaestroSendCode(e, percve, email) {
    setError("");
    try {
      const res = await fetch("/api/auth/maestros/enviarCodigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percve, correo: email }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("✅ Código enviado");
        setStep("verifyMaestro");
      } else {
        setError(data.message || "Error enviando el código");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error al enviar el código");
    }
  }

  async function handleMaestroVerifyCode(e, percve, code) {
    setError("");
    try {
      const res = await fetch("/api/auth/maestros/verificarCodigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percve, code }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("✅ Código verificado");
        setStep("updateMaestro");
      } else {
        setError(data.message || "Código incorrecto");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error verificando el código");
    }
  }

  async function handleMaestroUpdatePassword(e, percve, newPassword) {
    setError("");
    try {
      const res = await fetch("/api/auth/maestros/cambiarContra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percve, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("✅ Contraseña actualizada");
        // Ahora hacer login automáticamente con la nueva contraseña
        const loginRes = await fetch("/api/auth/maestros/iniciarSesion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ percve, password: newPassword }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          setFullName(loginData.nombre || "Maestro");
          setMaestroData(loginData.maestro);
          setStep("successMaestro");
        } else {
          setError(
            "Contraseña actualizada. Por favor inicia sesión nuevamente."
          );
          setStep("teacher");
        }
      } else {
        setError(data.message || "Error actualizando la contraseña");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error actualizando la contraseña");
    }
  }

  async function handleMaestroRegister(e, percve) {
    setError("");
    try {
      const res = await fetch("/api/auth/maestros/iniciarSesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percve, password: "profe123" }),
      });

      const data = await res.json();

      if (res.status === 403 && data.requiresVerification) {
        setStep("askEmailMaestro");
      } else if (res.ok) {
        setError(
          "Esta cuenta ya está verificada. Inicia sesión con tu contraseña personalizada."
        );
      } else {
        setError(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setError("Error al conectar con el servidor");
    }
  }

  return {
    handleMaestroLogin,
    handleMaestroSendCode,
    handleMaestroVerifyCode,
    handleMaestroUpdatePassword,
    handleMaestroRegister,
  };
}
