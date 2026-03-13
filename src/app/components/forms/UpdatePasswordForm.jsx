import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

const UpdatePasswordForm = ({ newPassword, setNewPassword, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="login-form">
      <h3
        style={{
          color: "#1b396a",
          marginBottom: "0.25rem",
          textAlign: "center",
        }}
      >
        Nueva contraseña
      </h3>
      <p
        style={{
          fontSize: "0.8rem",
          color: "#666",
          textAlign: "center",
          marginBottom: "0.75rem",
        }}
      >
        Elige una contraseña segura para tu cuenta.
      </p>

      <label className="login-label">Nueva contraseña:</label>
      <div className="input-with-icon password-input-container">
        <FaLock className="input-icon-left" />
        <input
          type={showPassword ? "text" : "password"}
          className="login-input with-left-icon"
          value={newPassword}
          placeholder="Ingresa tu nueva contraseña"
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle-icon"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>

      <button type="submit" className="submit-button">
        Actualizar contraseña
      </button>
    </form>
  );
};

export default UpdatePasswordForm;
