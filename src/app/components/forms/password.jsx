import React from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Password = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  placeholder,
}) => (
  <div className="input-with-icon password-input-container">
    <FaLock className="input-icon-left" />
    <input
      type={showPassword ? "text" : "password"}
      className="login-input with-left-icon"
      placeholder={placeholder}
      value={password}
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
);

export default Password;
