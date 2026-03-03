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

    <button type="submit" className="submit-button admin-button">
      Administrador
    </button>
  </form>
);

export default AdminForm;
