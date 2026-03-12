import React from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = ({
  matricula,
  setMatricula,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onSubmit,
  onForgotPassword,
  onRegister,
}) => (
  <form onSubmit={onSubmit} className="login-form">
    <label className="login-label">Matrícula:</label>
    <div className="input-with-icon">
      <FaUser className="input-icon-left" />
      <input
        type="text"
        className="login-input with-left-icon"
        value={matricula}
        placeholder="Ingresa tu matrícula"
        onChange={(e) => setMatricula(e.target.value)}
        required
      />
    </div>

    <label className="login-label">Contraseña:</label>
    <div className="input-with-icon password-input-container">
      <FaLock className="input-icon-left" />
      <input
        type={showPassword ? "text" : "password"}
        className="login-input with-left-icon"
        value={password}
        placeholder="Ingresa tu contraseña"
        onChange={(e) => setPassword(e.target.value)}
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

    <button type="submit" className="submit-button">
      Iniciar sesión
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

export default LoginForm;
