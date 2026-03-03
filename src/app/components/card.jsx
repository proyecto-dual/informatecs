import React from "react";
import { BookOpen, Inbox } from "lucide-react";

/**
 * Componente Card para mostrar una oferta de actividad
 * @param {Object} item - Objeto con la información de la oferta
 * @param {boolean} isSelected - Si la card está seleccionada
 * @param {Function} onClick - Callback al hacer clic en la card
 */
const Card = ({ item, isSelected, onClick }) => (
  <div
    className={`ofertas-card ${isSelected ? "selected" : ""}`}
    onClick={() => onClick(item)}
  >
    <div className="ofertas-card-header">
      <BookOpen className="ofertas-icon" /> Asignatura
    </div>
    <h3>{item.actividad.aconco}</h3>
    <p className="ofertas-description">
      Descubre más sobre esta actividad y sus beneficios.
    </p>
    <div className="ofertas-card-footer">
      <span>
        <Inbox /> {item.actividad.acodes}
      </span>
      Información
    </div>
  </div>
);

export default Card;
