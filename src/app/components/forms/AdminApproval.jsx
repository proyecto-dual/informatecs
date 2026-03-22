// src/app/admin-approval/page.jsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminApprovalContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
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
    <div style={s.page}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logoArea}>
          <div style={s.logoBox}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <span style={s.logoLabel}>Admin Panel</span>
        </div>
        <span style={s.secureBadge}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Conexión segura
        </span>
      </header>

      {/* Card */}
      <main style={s.main}>
        <div style={s.card}>
          {/* Icon */}
          <div style={s.iconRing}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1b396a"
              strokeWidth="1.8"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h2 style={s.title}>Aprobación de recuperación</h2>
          <p style={s.subtitle}>Eventos ITE · Administrador</p>

          {/* ── loading ── */}
          {status === "loading" && (
            <div style={s.loadingWrap}>
              <span style={s.spinner} />
              <span style={s.loadingText}>Verificando enlace...</span>
            </div>
          )}

          {/* ── invalid ── */}
          {status === "invalid" && (
            <div style={s.errorBox}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* ── ready ── */}
          {status === "ready" && (
            <div style={{ textAlign: "center" }}>
              <div style={s.infoBox}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1b396a"
                  strokeWidth="2"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#1b396a",
                    lineHeight: 1.6,
                    textAlign: "left",
                  }}
                >
                  El administrador <strong>{username}</strong> ha solicitado
                  recuperar su contraseña.
                </p>
              </div>

              <p style={s.infoText}>
                Al aprobar, se enviará automáticamente un enlace a su correo
                para que establezca su nueva contraseña.
              </p>

              <button onClick={handleApprove} style={s.approveBtn}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Aprobar solicitud
              </button>

              <p style={s.disclaimerText}>
                Si no reconoces esta solicitud, simplemente cierra esta página.
              </p>
            </div>
          )}

          {/* ── approving ── */}
          {status === "approving" && (
            <div style={s.loadingWrap}>
              <span style={s.spinner} />
              <span style={s.loadingText}>Procesando aprobación...</span>
            </div>
          )}

          {/* ── success ── */}
          {status === "success" && (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={s.successIcon}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1b396a"
                  strokeWidth="2.2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p
                style={{
                  margin: "0 0 6px",
                  fontWeight: 700,
                  color: "#1b396a",
                  fontSize: 15,
                }}
              >
                Aprobación confirmada
              </p>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 13,
                  color: "#5f6b7c",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#8a95a3" }}>
                Ya puedes cerrar esta página.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer style={s.pageFooter}>
        © 2026 Tu Empresa · Todos los derechos reservados
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Montserrat', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function AdminApprovalPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#f4f6fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid #dce3f0",
              borderTopColor: "#1b396a",
              borderRadius: "50%",
              animation: "spin .7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }
    >
      <AdminApprovalContent />
    </Suspense>
  );
}

// ── Tokens ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Montserrat', sans-serif",
    position: "relative",
    padding: "0 16px",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    background: "#1b396a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 32px",
  },
  logoArea: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: "rgba(255,255,255,.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLabel: { color: "#fff", fontWeight: 700, fontSize: 15 },
  secureBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: ".04em",
    color: "#fe9e10",
    border: "1.5px solid #fe9e10",
    borderRadius: 20,
    padding: "4px 11px",
  },

  main: { width: "100%", maxWidth: 440, zIndex: 1 },
  card: {
    background: "#fff",
    border: "1.5px solid #dce3f0",
    borderRadius: 16,
    padding: "40px 36px",
    boxShadow: "0 4px 24px rgba(27,57,106,.08)",
  },

  iconRing: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#eef2fa",
    border: "2px solid #8eafef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    textAlign: "center",
    color: "#1b396a",
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "-.02em",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#8a95a3",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    marginBottom: 28,
  },

  loadingWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "16px 0",
  },
  loadingText: { color: "#5f6b7c", fontSize: 13 },
  spinner: {
    display: "inline-block",
    width: 18,
    height: 18,
    border: "2.5px solid #dce3f0",
    borderTopColor: "#1b396a",
    borderRadius: "50%",
    animation: "spin .7s linear infinite",
    flexShrink: 0,
  },

  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    background: "#eef2fa",
    border: "1.5px solid #8eafef",
    borderLeft: "4px solid #1b396a",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 16,
    textAlign: "left",
  },
  infoText: {
    fontSize: 13,
    color: "#5f6b7c",
    lineHeight: 1.65,
    marginBottom: 24,
    textAlign: "center",
  },

  approveBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "13px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#1b396a",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: ".04em",
    boxShadow: "0 2px 10px rgba(27,57,106,.2)",
    transition: "background .2s",
    marginBottom: 14,
  },
  disclaimerText: {
    fontSize: 11,
    color: "#aab4c4",
    lineHeight: 1.6,
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fef2f2",
    border: "1.5px solid #fca5a5",
    borderLeft: "4px solid #ef4444",
    borderRadius: 10,
    padding: "14px 16px",
    color: "#b91c1c",
    fontSize: 13,
    fontWeight: 600,
  },

  successIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "#eef2fa",
    border: "2px solid #8eafef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },

  pageFooter: {
    position: "absolute",
    bottom: 18,
    fontSize: 11,
    color: "#9ca3af",
    letterSpacing: ".01em",
  },
};
