// src/app/admin-approval/page.jsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminApprovalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | ready | approving | success | invalid
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setMessage("No se proporcionó ningún token.");
      return;
    }

    fetch(`/api/auth/adminApproval?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.valid) {
          setUsername(data.username);
          setStatus("ready");
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
    setStatus("approving");
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
        setStatus("invalid");
        setMessage(data.message || "Error al procesar la aprobación.");
      }
    } catch {
      setStatus("invalid");
      setMessage("Error al conectar con el servidor.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Eventos ITE</h2>
        <p style={styles.subtitle}>Panel de aprobación de recuperación</p>

        {status === "loading" && (
          <p style={{ color: "#666", textAlign: "center" }}>
            Verificando enlace...
          </p>
        )}

        {status === "invalid" && (
          <div style={styles.errorBox}>
            <p style={{ margin: 0 }}>❌ {message}</p>
          </div>
        )}

        {status === "ready" && (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#444",
                fontSize: "0.95rem",
                marginBottom: "1.5rem",
              }}
            >
              El administrador{" "}
              <strong style={{ color: "#1b396a" }}>{username}</strong> ha
              solicitado recuperar su contraseña.
            </p>
            <p
              style={{
                color: "#555",
                fontSize: "0.88rem",
                marginBottom: "2rem",
              }}
            >
              Al aprobar, se enviará automáticamente un enlace a su correo para
              que él mismo establezca su nueva contraseña.
            </p>
            <button onClick={handleApprove} style={styles.approveBtn}>
              ✅ Aprobar solicitud
            </button>
            <p
              style={{ color: "#aaa", fontSize: "0.78rem", marginTop: "1rem" }}
            >
              Si no reconoces esta solicitud, simplemente cierra esta página.
            </p>
          </div>
        )}

        {status === "approving" && (
          <p style={{ color: "#666", textAlign: "center" }}>
            Procesando aprobación...
          </p>
        )}

        {status === "success" && (
          <div style={styles.successBox}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "1rem" }}>
              ✅ Aprobación confirmada
            </p>
            <p
              style={{
                margin: "0.75rem 0 0",
                fontSize: "0.87rem",
                color: "#555",
              }}
            >
              {message}
            </p>
            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.82rem",
                color: "#888",
              }}
            >
              Ya puedes cerrar esta página.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminApprovalPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          Cargando...
        </div>
      }
    >
      <AdminApprovalContent />
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
    maxWidth: "440px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  title: { color: "#1b396a", textAlign: "center", marginBottom: "0.25rem" },
  subtitle: {
    color: "#888",
    textAlign: "center",
    fontSize: "0.85rem",
    marginBottom: "1.5rem",
  },
  approveBtn: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.85rem 2rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
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
    textAlign: "center",
    color: "#27ae60",
  },
};
