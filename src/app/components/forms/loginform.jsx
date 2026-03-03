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

    <button type="submit" className="submit-button">
      Iniciar sesión
    </button>
  </form>
);

export default LoginForm;
