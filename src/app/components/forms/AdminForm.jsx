import React from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const AdminForm = ({
  adminUser,
  setAdminUser,
  adminPassword,
  setAdminPassword,
  showPassword,
  setShowPassword,
  onSubmit,
  onForgotPassword,
  onRegister,
}) => (
  <form onSubmit={onSubmit} className="login-form">
    <label className="login-label">Usuario:</label>
    <div className="input-with-icon">
      <FaUser className="input-icon-left" />
      <input
        type="text"
        className="login-input with-left-icon"
        value={adminUser}
        placeholder="Ingresa tu usuario"
        onChange={(e) => setAdminUser(e.target.value)}
        required
      />
    </div>

    <label className="login-label">Contraseña:</label>
    <div className="input-with-icon password-input-container">
      <FaLock className="input-icon-left" />
      <input
        type={showPassword ? "text" : "password"}
        className="login-input with-left-icon"
        value={adminPassword}
        placeholder="Ingresa tu contraseña"
        onChange={(e) => setAdminPassword(e.target.value)}
        required
      />
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-icon"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* Olvidé contraseña */}
    {onForgotPassword && (
      <div style={{ textAlign: "right", marginBottom: "0.75rem" }}>
        <button
          type="button"
          onClick={onForgotPassword}
          style={{
            background: "none",
            border: "none",
            color: "#1b396a",
            fontSize: "0.8rem",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            padding: 0,
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    )}

    <button type="submit" className="submit-button admin-button">
      Administrador
    </button>

    {/* Registrarse */}
    {onRegister && (
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span style={{ fontSize: "0.875rem", color: "#666" }}>
          ¿No tienes cuenta?{" "}
        </span>
        <button
          type="button"
          onClick={onRegister}
          style={{
            background: "none",
            border: "none",
            color: "#1b396a",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "0.875rem",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            padding: 0,
          }}
        >
          Regístrate aquí
        </button>
      </div>
    )}
  </form>
);

export default AdminForm;
