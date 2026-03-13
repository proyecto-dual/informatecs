// src/app/components/forms/AdminForgotForm.jsx
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";

const AdminForgotForm = ({ onBack }) => {
  const [adminUser, setAdminUser] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminUser.trim()) {
      setStatus("error");
      setMessage("Escribe tu usuario de administrador");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/adminRecovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUser }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || "Error al enviar la solicitud");
      }
    } catch {
      setStatus("error");
      setMessage("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h3
        style={{
          color: "#1b396a",
          marginBottom: "0.25rem",
          textAlign: "center",
        }}
      >
        Recuperar contraseña
      </h3>
      <p
        style={{
          fontSize: "0.82rem",
          color: "#666",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        Se notificará al propietario del sistema para que apruebe el cambio.
      </p>

      <label className="login-label">Usuario administrador:</label>
      <div className="input-with-icon">
        <FaUser className="input-icon-left" />
        <input
          type="text"
          className="login-input with-left-icon"
          value={adminUser}
          placeholder="Ej: NodalTec"
          onChange={(e) => setAdminUser(e.target.value)}
          disabled={status === "loading" || status === "success"}
          required
        />
      </div>

      {status === "error" && (
        <p
          style={{
            color: "#c0392b",
            fontSize: "0.82rem",
            marginTop: "0.25rem",
          }}
        >
          ⚠️ {message}
        </p>
      )}

      {status === "success" && (
        <div
          style={{
            background: "#eafaf1",
            border: "1px solid #27ae60",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
            marginTop: "0.5rem",
          }}
        >
          <p style={{ color: "#27ae60", fontSize: "0.85rem", margin: 0 }}>
            ✅ {message}
          </p>
        </div>
      )}

      {status !== "success" && (
        <button
          type="submit"
          className="submit-button"
          disabled={status === "loading"}
          style={{ marginTop: "1rem", opacity: status === "loading" ? 0.7 : 1 }}
        >
          {status === "loading" ? "Enviando..." : "Solicitar recuperación"}
        </button>
      )}

      <button
        type="button"
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#1b396a",
          fontSize: "0.85rem",
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          marginTop: "0.75rem",
          display: "block",
          width: "100%",
          textAlign: "center",
          padding: 0,
        }}
      >
        ← Volver al inicio de sesión
      </button>
    </form>
  );
};

export default AdminForgotForm;
