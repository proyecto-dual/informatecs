import React from "react";
import { X, Timer, Code2, Star } from "lucide-react";

/**
 * Componente Modal para mostrar detalles de una oferta
 * @param {Object} item - Objeto con la información de la oferta
 * @param {Function} onClose - Callback para cerrar el modal
 * @param {Function} onRegister - Callback para registrarse en la actividad
 */
const OfferModal = ({ item, onClose, onRegister }) => (
  <div className="ofertas-modal-overlay" onClick={onClose}>
    <div className="ofertas-modal" onClick={(e) => e.stopPropagation()}>
      <button
        className="ofertas-close-btn"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <X size={24} />
      </button>
      {item.actividad.image && (
        <img
          src={item.actividad.image}
          alt={item.actividad.aconco}
          className="ofertas-modal-img"
        />
      )}
      <h1 className="ofertas-modal-h1">{item.actividad.aconco}</h1>
      <div className="ofertas-modal-content">
        <p className="ofertas-description">
          Esta actividad forma parte de la oferta del semestre. Conoce sus
          detalles y regístrate para participar.
        </p>

        <div className="ofertas-info-grid">
          <div className="ofertas-info-item">
            <Timer className="ofertas-icon" />
            <span>
              <strong>Horas:</strong> {item.actividad.acohrs}
            </span>
          </div>
          <div className="ofertas-info-item">
            <Code2 className="ofertas-icon" />
            <span>
              <strong>Código:</strong> {item.actividad.acocve}
            </span>
          </div>
          <div className="ofertas-info-item">
            <Star className="ofertas-icon" />
            <span>
              <strong>Créditos:</strong> {item.actividad.acocre}
            </span>
          </div>
        </div>
      </div>

      <button
        className="ofertas-register-btn"
        onClick={() => onRegister(item)} // Pasa el objeto de la oferta seleccionado
      >
        Registrarme en esta oferta
      </button>
    </div>
  </div>
);

export default OfferModal;
