// app/components/forms/AdminApproval.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const AdminApproval = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("No se proporcionó ningún token.");
      return;
    }

    fetch(`/api/auth/adminApproval/validate?token=${token}`)
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

  const handleApprove = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/adminApproval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || "Error al aprobar.");
      }
    } catch {
      setStatus("error");
      setMessage("Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🔐 Eventos ITE</h2>
        <p style={s.subtitle}>Panel de aprobación administrativa</p>

        {status === "loading" && <p style={s.center}>Verificando enlace...</p>}

        {status === "invalid" && <div style={s.errorBox}>❌ {message}</div>}

        {status === "valid" && (
          <div>
            <p
              style={{
                color: "#444",
                fontSize: "15px",
                textAlign: "center",
                marginBottom: "6px",
              }}
            >
              El administrador{" "}
              <strong style={{ color: "#1b396a" }}>{username}</strong> ha
              solicitado recuperar su contraseña.
            </p>
            <p
              style={{
                color: "#666",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: "28px",
              }}
            >
              Al aprobar, se le enviará un correo con un enlace para que{" "}
              <strong>él mismo</strong> establezca su nueva contraseña.
            </p>
            {message && (
              <p
                style={{
                  color: "#c0392b",
                  fontSize: "13px",
                  textAlign: "center",
                  marginBottom: "12px",
                }}
              >
                ⚠️ {message}
              </p>
            )}
            <button
              onClick={handleApprove}
              disabled={submitting}
              style={{ ...s.btn, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Enviando..." : "✅ Aprobar solicitud"}
            </button>
          </div>
        )}

        {status === "success" && (
          <div style={s.successBox}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "15px" }}>
              ✅ ¡Solicitud aprobada!
            </p>
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#555" }}>
              {message}
            </p>
          </div>
        )}

        {status === "error" && <div style={s.errorBox}>❌ {message}</div>}
      </div>
    </div>
  );
};

export default AdminApproval;

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
    maxWidth: "440px",
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
  btn: {
    width: "100%",
    padding: "0.85rem",
    background: "#1b396a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
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
