import React from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";

const AskEmailForm = ({
  matricula,
  setMatricula,
  email,
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
          fontSize: "0.8rem",
          color: "#666",
          textAlign: "center",
          marginBottom: "0.75rem",
        }}
      >
        Ingresa tu matrícula y te enviaremos un código a tu correo
        institucional.
      </p>

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
            fontSize: "0.76rem",
            marginTop: "-0.5rem",
            marginBottom: "0.25rem",
            color: showEmailError ? "#c0392b" : "#1b396a",
          }}
        >
          {showEmailError
            ? `❌ Debe ser: al${matricula}@ite.edu.mx`
            : `✉️ Tu correo: al${matricula}@ite.edu.mx`}
        </p>
      )}

      <button type="submit" className="submit-button">
        Enviar código
      </button>
    </form>
  );
};

export default AskEmailForm;
