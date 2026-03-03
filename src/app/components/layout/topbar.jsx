"use client";
import React from "react";
import { FaInstagram, FaTwitter } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="header-title">Eventos ITE</h1>
      </div>
      <div className="topbar-right">
        {/* Mantener redes sociales para una fácil interacción */}
        <FaInstagram className="icon" />
        <FaTwitter className="icon" />
      </div>
    </div>
  );
};

export default TopBar;
