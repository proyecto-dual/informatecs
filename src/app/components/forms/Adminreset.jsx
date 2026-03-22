// src/app/admin-reset/page.jsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | valid | invalid | success
  const [pageMessage, setPageMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setPageMessage("No se proporcionó ningún token.");
      return;
    }

    fetch(`/api/auth/adminReset?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setUsername(data.username);
          setStatus("valid");
        } else {
          setStatus("invalid");
          setPageMessage(data.message);
        }
      })
      .catch(() => {
        setStatus("invalid");
        setPageMessage("Error al verificar el enlace.");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (newPassword !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/adminReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setPageMessage(data.message);
      } else {
        setFormError(data.message || "Error al actualizar la contraseña.");
      }
    } catch {
      setFormError("Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}> Eventos ITE</h2>
        <p style={styles.subtitle}>Restablece tu contraseña de administrador</p>

        {status === "loading" && (
          <p style={{ color: "#666", textAlign: "center" }}>
            Verificando enlace...
          </p>
        )}

        {status === "invalid" && (
          <div style={styles.errorBox}>
            <p style={{ margin: 0 }}>❌ {pageMessage}</p>
          </div>
        )}

        {status === "valid" && (
          <form onSubmit={handleSubmit}>
            <p
              style={{
                color: "#444",
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              Hola <strong style={{ color: "#1b396a" }}>{username}</strong>,
              escribe tu nueva contraseña.
            </p>

            <label style={styles.label}>Nueva contraseña</label>
            <div style={styles.inputWrap}>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <label style={styles.label}>Confirmar contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              style={{ ...styles.input, marginTop: "4px" }}
              required
            />

            {formError && (
              <p
                style={{
                  color: "#c0392b",
                  fontSize: "0.83rem",
                  marginTop: "0.5rem",
                }}
              >
                ⚠️ {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ ...styles.btn, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        )}

        {status === "success" && (
          <div style={styles.successBox}>
            <p style={{ margin: 0, fontWeight: 600 }}>✅ {pageMessage}</p>
            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.85rem",
                color: "#555",
              }}
            >
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <a
              href="/"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                background: "#1b396a",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Ir al inicio de sesión
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminResetPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          Cargando...
        </div>
      }
    >
      <AdminResetContent />
    </Suspense>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1b396a 0%, #2e5fa3 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  title: { color: "#1b396a", textAlign: "center", marginBottom: "0.25rem" },
  subtitle: {
    color: "#888",
    textAlign: "center",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.83rem",
    color: "#555",
    fontWeight: 600,
    marginBottom: "4px",
    marginTop: "0.75rem",
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "0.6rem 0.75rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.9rem",
    boxSizing: "border-box",
    outline: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  },
  btn: {
    width: "100%",
    padding: "0.75rem",
    background: "#1b396a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "1.25rem",
  },
  errorBox: {
    background: "#fdecea",
    border: "1px solid #e74c3c",
    borderRadius: "8px",
    padding: "1rem",
    color: "#c0392b",
    textAlign: "center",
  },
  successBox: {
    background: "#eafaf1",
    border: "1px solid #27ae60",
    borderRadius: "8px",
    padding: "1.25rem",
    color: "#27ae60",
    textAlign: "center",
  },
};
