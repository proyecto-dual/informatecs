// // src/app/admin-reset/page.jsx
// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { useSearchParams } from "next/navigation";

// function AdminResetContent() {
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const [status, setStatus] = useState("loading"); // loading | valid | invalid | success
//   const [pageMessage, setPageMessage] = useState("");
//   const [username, setUsername] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [formError, setFormError] = useState("");

//   useEffect(() => {
//     if (!token) {
//       setStatus("invalid");
//       setPageMessage("No se proporcionó ningún token.");
//       return;
//     }

//     fetch(`/api/auth/adminReset?token=${token}`)
//       .then((r) => r.json())
//       .then((data) => {
//         if (data.valid) {
//           setUsername(data.username);
//           setStatus("valid");
//         } else {
//           setStatus("invalid");
//           setPageMessage(data.message);
//         }
//       })
//       .catch(() => {
//         setStatus("invalid");
//         setPageMessage("Error al verificar el enlace.");
//       });
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     if (newPassword !== confirmPassword) {
//       setFormError("Las contraseñas no coinciden.");
//       return;
//     }
//     if (newPassword.length < 6) {
//       setFormError("La contraseña debe tener al menos 6 caracteres.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await fetch("/api/auth/adminReset", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, newPassword }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setStatus("success");
//         setPageMessage(data.message);
//       } else {
//         setFormError(data.message || "Error al actualizar la contraseña.");
//       }
//     } catch {
//       setFormError("Error al conectar con el servidor.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h2 style={styles.title}> Eventos ITE</h2>
//         <p style={styles.subtitle}>Restablece tu contraseña de administrador</p>

//         {status === "loading" && (
//           <p style={{ color: "#666", textAlign: "center" }}>
//             Verificando enlace...
//           </p>
//         )}

//         {status === "invalid" && (
//           <div style={styles.errorBox}>
//             <p style={{ margin: 0 }}>❌ {pageMessage}</p>
//           </div>
//         )}

//         {status === "valid" && (
//           <form onSubmit={handleSubmit}>
//             <p
//               style={{
//                 color: "#444",
//                 marginBottom: "1.25rem",
//                 textAlign: "center",
//               }}
//             >
//               Hola <strong style={{ color: "#1b396a" }}>{username}</strong>,
//               escribe tu nueva contraseña.
//             </p>

//             <label style={styles.label}>Nueva contraseña</label>
//             <div style={styles.inputWrap}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Mínimo 6 caracteres"
//                 style={styles.input}
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={styles.eyeBtn}
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>

//             <label style={styles.label}>Confirmar contraseña</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Repite la contraseña"
//               style={{ ...styles.input, marginTop: "4px" }}
//               required
//             />

//             {formError && (
//               <p
//                 style={{
//                   color: "#c0392b",
//                   fontSize: "0.83rem",
//                   marginTop: "0.5rem",
//                 }}
//               >
//                 ⚠️ {formError}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={submitting}
//               style={{ ...styles.btn, opacity: submitting ? 0.7 : 1 }}
//             >
//               {submitting ? "Guardando..." : "Guardar nueva contraseña"}
//             </button>
//           </form>
//         )}

//         {status === "success" && (
//           <div style={styles.successBox}>
//             <p style={{ margin: 0, fontWeight: 600 }}>✅ {pageMessage}</p>
//             <p
//               style={{
//                 margin: "0.5rem 0 0",
//                 fontSize: "0.85rem",
//                 color: "#555",
//               }}
//             >
//               Ya puedes iniciar sesión con tu nueva contraseña.
//             </p>
//             <a
//               href="/"
//               style={{
//                 display: "inline-block",
//                 marginTop: "1rem",
//                 background: "#1b396a",
//                 color: "#fff",
//                 padding: "10px 24px",
//                 borderRadius: "8px",
//                 textDecoration: "none",
//                 fontWeight: 700,
//                 fontSize: "0.9rem",
//               }}
//             >
//               Ir al inicio de sesión
//             </a>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function AdminResetPage() {
//   return (
//     <Suspense
//       fallback={
//         <div style={{ textAlign: "center", marginTop: "3rem" }}>
//           Cargando...
//         </div>
//       }
//     >
//       <AdminResetContent />
//     </Suspense>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #1b396a 0%, #2e5fa3 100%)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "1rem",
//   },
//   card: {
//     background: "#fff",
//     borderRadius: "16px",
//     padding: "2rem",
//     width: "100%",
//     maxWidth: "420px",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
//   },
//   title: { color: "#1b396a", textAlign: "center", marginBottom: "0.25rem" },
//   subtitle: {
//     color: "#888",
//     textAlign: "center",
//     fontSize: "0.85rem",
//     marginBottom: "1.5rem",
//   },
//   label: {
//     display: "block",
//     fontSize: "0.83rem",
//     color: "#555",
//     fontWeight: 600,
//     marginBottom: "4px",
//     marginTop: "0.75rem",
//   },
//   inputWrap: { position: "relative" },
//   input: {
//     width: "100%",
//     padding: "0.6rem 0.75rem",
//     border: "1px solid #ddd",
//     borderRadius: "8px",
//     fontSize: "0.9rem",
//     boxSizing: "border-box",
//     outline: "none",
//   },
//   eyeBtn: {
//     position: "absolute",
//     right: "0.75rem",
//     top: "50%",
//     transform: "translateY(-50%)",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "1rem",
//   },
//   btn: {
//     width: "100%",
//     padding: "0.75rem",
//     background: "#1b396a",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "1rem",
//     fontWeight: 700,
//     cursor: "pointer",
//     marginTop: "1.25rem",
//   },
//   errorBox: {
//     background: "#fdecea",
//     border: "1px solid #e74c3c",
//     borderRadius: "8px",
//     padding: "1rem",
//     color: "#c0392b",
//     textAlign: "center",
//   },
//   successBox: {
//     background: "#eafaf1",
//     border: "1px solid #27ae60",
//     borderRadius: "8px",
//     padding: "1.25rem",
//     color: "#27ae60",
//     textAlign: "center",
//   },
// };
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AdminResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
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
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 style={s.title}>Restablecer contraseña</h2>
          <p style={s.subtitle}>Eventos ITE · Administrador</p>

          {/* ── Estados ── */}

          {status === "loading" && (
            <div style={s.loadingWrap}>
              <span style={s.spinner} />
              <span style={s.loadingText}>Verificando enlace...</span>
            </div>
          )}

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
              <span>{pageMessage}</span>
            </div>
          )}

          {status === "valid" && (
            <form onSubmit={handleSubmit}>
              <p style={s.welcomeText}>
                Hola <strong style={{ color: "#1b396a" }}>{username}</strong>,
                escribe tu nueva contraseña.
              </p>

              <label style={s.label}>Nueva contraseña</label>
              <div style={s.inputWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  style={s.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1b396a";
                    e.target.style.boxShadow = "0 0 0 3px rgba(27,57,106,.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={s.eyeBtn}
                  title={showPassword ? "Ocultar" : "Mostrar"}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8a95a3"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8a95a3"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <label style={{ ...s.label, marginTop: 14 }}>
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                style={s.input}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1b396a";
                  e.target.style.boxShadow = "0 0 0 3px rgba(27,57,106,.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
                required
              />

              {formError && (
                <div style={s.formErrorBox}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...s.btn,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? (
                  <>
                    <span style={s.spinnerSm} /> Guardando...
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Guardar nueva contraseña
                  </>
                )}
              </button>
            </form>
          )}

          {status === "success" && (
            <div style={s.successBox}>
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
                  margin: "0 0 4px",
                  fontWeight: 700,
                  color: "#1b396a",
                  fontSize: 15,
                }}
              >
                {pageMessage}
              </p>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#5f6b7c" }}>
                Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <a href="/" style={s.backLink}>
                Ir al inicio de sesión
              </a>
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
        input::placeholder { color: #9ca3af; font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}

export default function AdminResetPage() {
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
              width: 380,
              background: "#fff",
              border: "1.5px solid #dce3f0",
              borderRadius: 16,
              padding: "40px 36px",
              boxShadow: "0 4px 24px rgba(27,57,106,.08)",
            }}
          >
            {[
              { h: 56, w: 56, r: "50%", mb: 22, mx: "auto" },
              { h: 22, w: "55%", r: 8, mb: 8, mx: "auto" },
              { h: 12, w: "70%", r: 6, mb: 28, mx: "auto" },
              { h: 44, w: "100%", r: 10, mb: 12, mx: 0 },
              { h: 44, w: "100%", r: 10, mb: 0, mx: 0 },
            ].map((row, i) => (
              <div
                key={i}
                style={{
                  height: row.h,
                  width: row.w,
                  borderRadius: row.r,
                  marginBottom: row.mb,
                  marginLeft: row.mx,
                  marginRight: row.mx,
                  background:
                    "linear-gradient(90deg,#e8edf4 25%,#f4f6fb 50%,#e8edf4 75%)",
                  backgroundSize: "400px 100%",
                  animation: "shimmer 1.4s ease-in-out infinite",
                  display: "block",
                }}
              />
            ))}
          </div>
          <style>{`@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>
        </div>
      }
    >
      <AdminResetContent />
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

  main: { width: "100%", maxWidth: 420, zIndex: 1 },
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
    fontSize: 12,
    marginBottom: 28,
    letterSpacing: ".02em",
    textTransform: "uppercase",
    fontWeight: 600,
  },

  loadingWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "16px 0",
    color: "#5f6b7c",
    fontSize: 13,
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
  spinnerSm: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,.35)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin .7s linear infinite",
  },

  welcomeText: {
    color: "#5f6b7c",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#1b396a",
    marginBottom: 7,
    letterSpacing: ".06em",
    textTransform: "uppercase",
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    background: "#f8faff",
    border: "1.5px solid #d1d5db",
    borderRadius: 10,
    padding: "11px 40px 11px 13px",
    fontSize: 13,
    color: "#333333",
    fontFamily: "'Montserrat', sans-serif",
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },

  formErrorBox: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "#fef2f2",
    border: "1.5px solid #fca5a5",
    borderLeft: "4px solid #ef4444",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: 500,
    marginTop: 10,
  },

  btn: {
    width: "100%",
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "13px 20px",
    borderRadius: 10,
    border: "none",
    background: "#1b396a",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: ".04em",
    boxShadow: "0 2px 10px rgba(27,57,106,.2)",
    transition: "opacity .2s",
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

  successBox: {
    textAlign: "center",
    padding: "8px 0",
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
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    background: "#1b396a",
    color: "#fff",
    padding: "11px 28px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: ".04em",
    boxShadow: "0 2px 10px rgba(27,57,106,.2)",
  },

  pageFooter: {
    position: "absolute",
    bottom: 18,
    fontSize: 11,
    color: "#9ca3af",
    letterSpacing: ".01em",
  },
};
