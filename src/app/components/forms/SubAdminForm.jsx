"use client";
import { FaUser, FaLock } from "react-icons/fa";

export default function SubAdminForm({
  adminUser,
  setAdminUser,
  adminPassword,
  setAdminPassword,
  showPassword,
  setShowPassword,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="login-form">
      <h3 style={{ color: "#1b396a", marginBottom: "0.25rem", textAlign: "center" }}>
        Sub Administrador
      </h3>
      <p style={{ fontSize: "0.82rem", color: "#666", textAlign: "center", marginBottom: "1.25rem" }}>
        Acceso exclusivo para sub administrador
      </p>

      <label className="login-label">Usuario:</label>
      <div className="input-with-icon">
        <FaUser className="input-icon-left" />
        <input
          type="text"
          className="login-input with-left-icon"
          value={adminUser}
          placeholder="Usuario"
          onChange={(e) => setAdminUser(e.target.value)}
          required
        />
      </div>

      <label className="login-label" style={{ marginTop: "0.75rem" }}>Contraseña:</label>
      <div className="input-with-icon">
        <FaLock className="input-icon-left" />
        <input
          type={showPassword ? "text" : "password"}
          className="login-input with-left-icon with-right-icon"
          value={adminPassword}
          placeholder="Contraseña"
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <button type="submit" className="submit-button" style={{ marginTop: "1.25rem" }}>
        Iniciar sesión
      </button>
    </form>
  );
}