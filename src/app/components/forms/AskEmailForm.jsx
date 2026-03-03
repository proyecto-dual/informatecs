import React from "react";

const AskEmailForm = ({ email, setEmail, onSubmit }) => (
  <form onSubmit={onSubmit} className="login-form">
    <label className="login-label">Correo electrónico</label>
    <input
      type="email"
      className="login-input"
      value={email}
      placeholder="correo@ejemplo.com"
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <button type="submit" className="submit-button">
      Enviar código
    </button>
  </form>
);

export default AskEmailForm;
