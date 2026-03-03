"use client";
import React from "react";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram, FaTiktok } from "react-icons/fa6";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
       
        <div className="footer-section">
          <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Reemplazamos el icono por tu logo real */}
            <img 
              src="/imagenes/itelogo.png" 
              alt="Logo ITE" 
              className="footer-logo-img"
              style={{ width: '40px', height: 'auto' }} // Ajusta el tamaño según necesites
            />
            <span className="footer-title">TECNM</span>
          </div>
         
          <p className="footer-text">Instituto Tecnológico de Ensenada</p>

          <div className="footer-social">
            <h3 className="footer-subtitle">Síguenos</h3>
            <div className="footer-social-icons">
              <a href="https://www.facebook.com/TecNMITEnsenada?mibextid=wwXIfr&rdid=EvhXgpg8KzjrouOK&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ab9zD6jcv%2F%3Fmibextid%3DwwXIfr#" className="social-circle">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/tecnmensenada?igsh=MTNxeWdkaXh4Zml3OA%3D%3D" className="social-circle">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@tecnm_itensenada?_r=1&_t=ZS-93USOREFR2W" className="social-circle">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        
        <div className="footer-section">
          <h3 className="footer-subtitle">Enlaces</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Inicio</a>
            </li>
            <li>
              <a href="/designs/vistaEventos">Noticias</a>
            </li>
            <li>
              <a href="/designs/vistaintramuros">Intramuros</a>
            </li>
            <li>
              <a href="/designs/vistaHorarios">Horarios</a>
            </li>
            <li>
              <a href="/designs/vistaLogin">Iniciar Sesion </a>
            </li>
          </ul>
        </div>

       
        <div className="footer-section">
          <h3 className="footer-subtitle">Contacto</h3>
          <ul className="footer-contact">
            <li>Ensenada, B.C.</li>
            <li>
              <a href="mailto:info@ite.edu.mx">info@ite.edu.mx</a>
            </li>
            <li>(646) 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Instituto Tecnológico de Ensenada. Todos
        los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
