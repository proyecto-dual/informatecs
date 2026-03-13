import React from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";

const RegisterForm = ({
  matricula = "",
  setMatricula,
  email = "",
  setEmail,
  onSubmit,
}) => {
  const expectedEmail = matricula ? `al${matricula}@ite.edu.mx` : "";
  const emailIsValid =
    email.trim().toLowerCase() === expectedEmail.toLowerCase();
  const showEmailError =
    email.length > 0 && matricula.length > 0 && !emailIsValid;

  return (
    <form onSubmit={onSubmit} className="login-form">
      {/* Matrícula */}
      <label className="login-label">Matrícula:</label>
      <div className="input-with-icon">
        <FaUser className="input-icon-left" />
        <input
          type="text"
          className="login-input with-left-icon"
          value={matricula}
          placeholder="Ej: 20760204"
          onChange={(e) => setMatricula(e.target.value)}
          required
        />
      </div>

      {/* Correo institucional */}
      <label className="login-label">Correo institucional:</label>
      <div className="input-with-icon">
        <FaEnvelope className="input-icon-left" />
        <input
          type="email"
          className="login-input with-left-icon"
          value={email}
          placeholder={
            matricula ? `al${matricula}@ite.edu.mx` : "al________@ite.edu.mx"
          }
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Hint / error en tiempo real */}
      {matricula && (
        <p
          style={{
            fontSize: "0.78rem",
            marginTop: "-0.5rem",
            marginBottom: "0.5rem",
            color: showEmailError ? "#c0392b" : "#1b396a",
          }}
        >
          {showEmailError
            ? `❌ Debe ser: al${matricula}@ite.edu.mx`
            : `✉️ Tu correo: al${matricula}@ite.edu.mx`}
        </p>
      )}

      <p
        style={{ fontSize: "0.78rem", color: "#666", marginBottom: "0.25rem" }}
      >
        Se enviará un código a tu correo para verificar tu cuenta y crear tu
        contraseña.
      </p>

      <button type="submit" className="submit-button">
        Enviar código de verificación
      </button>
    </form>
  );
};

export default RegisterForm;
