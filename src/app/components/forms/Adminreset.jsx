"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminReset = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("No se proporcionó ningún token.");
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
          setMessage(data.message);
        }
      })
      .catch(() => {
        setStatus("invalid");
        setMessage("Error al verificar el enlace.");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Mínimo 6 caracteres.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/adminReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setTimeout(() => (window.location.href = "/"), 3000);
      } else {
        setMessage(data.message || "Error al actualizar.");
      }
    } catch {
      setMessage("Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🔐 Eventos ITE</h2>
        <p style={s.subtitle}>Restablece tu contraseña</p>

        {status === "loading" && <p style={s.center}>Verificando enlace...</p>}

        {status === "invalid" && <div style={s.errorBox}>❌ {message}</div>}

        {status === "valid" && (
          <form onSubmit={handleSubmit}>
            <p
              style={{
                color: "#444",
                textAlign: "center",
                fontSize: "14px",
                marginBottom: "1.25rem",
              }}
            >
              Hola <strong style={{ color: "#1b396a" }}>{username}</strong>,
              elige tu nueva contraseña.
            </p>

            <label style={s.label}>Nueva contraseña</label>
            <div style={s.wrap}>
              <FaLock style={s.iconL} />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                style={s.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={s.eye}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label style={s.label}>Confirmar contraseña</label>
            <div style={s.wrap}>
              <FaLock style={s.iconL} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                style={s.input}
                required
              />
            </div>

            {message && (
              <p
                style={{ color: "#c0392b", fontSize: "13px", marginTop: "8px" }}
              >
                ⚠️ {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ ...s.btn, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Guardando..." : "🔑 Guardar nueva contraseña"}
            </button>
          </form>
        )}

        {status === "success" && (
          <div style={s.successBox}>
            <p style={{ margin: 0, fontWeight: 700 }}>✅ {message}</p>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#555" }}>
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReset;

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#1b396a,#2e5fa3)",
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
    boxShadow: "0 8px 32px rgba(0,0,0,.15)",
  },
  title: { color: "#1b396a", textAlign: "center", margin: "0 0 4px" },
  subtitle: {
    color: "#888",
    textAlign: "center",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
  },
  center: { color: "#666", textAlign: "center" },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#555",
    fontWeight: 600,
    marginBottom: "4px",
    marginTop: "12px",
  },
  wrap: { position: "relative" },
  iconL: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#aaa",
    fontSize: "13px",
  },
  input: {
    width: "100%",
    padding: "0.6rem 2.5rem 0.6rem 2.2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  },
  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
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
  successBox: {
    background: "#eafaf1",
    border: "1px solid #27ae60",
    borderRadius: "8px",
    padding: "1.25rem",
    color: "#27ae60",
    textAlign: "center",
  },
  errorBox: {
    background: "#fdecea",
    border: "1px solid #e74c3c",
    borderRadius: "8px",
    padding: "1rem",
    color: "#c0392b",
    textAlign: "center",
  },
};
