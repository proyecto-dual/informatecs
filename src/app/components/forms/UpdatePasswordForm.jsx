import React from "react";

const UpdatePasswordForm = ({ newPassword, setNewPassword, onSubmit }) => (
  <form onSubmit={onSubmit} className="login-form">
    <label className="login-label">Nueva contraseña</label>
    <input
      type="password"
      className="login-input"
      value={newPassword}
      placeholder="Ingresa tu nueva contraseña"
      onChange={(e) => setNewPassword(e.target.value)}
      required
    />
    <button type="submit" className="submit-button">
      Actualizar contraseña
    </button>
  </form>
);

export default UpdatePasswordForm;
