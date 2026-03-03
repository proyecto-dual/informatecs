import React from "react";

const VerifyCodeForm = ({ code, setCode, onSubmit }) => (
  <form onSubmit={onSubmit} className="login-form">
    <label className="login-label">Código de verificación</label>
    <input
      type="text"
      className="login-input"
      value={code}
      placeholder="Ingresa el código de 6 dígitos"
      onChange={(e) => setCode(e.target.value)}
      required
    />
    <button type="submit" className="submit-button">
      Verificar código
    </button>
  </form>
);

export default VerifyCodeForm;
