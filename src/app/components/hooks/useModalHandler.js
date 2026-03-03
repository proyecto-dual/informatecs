import { useState } from "react";

/**
 * Hook para manejar el estado del modal de oferta
 * Controla qué item está seleccionado y si el modal está abierto
 * @returns {Object} Estado y funciones para controlar el modal
 */
export const useModalHandler = () => {
  // Item completo seleccionado (contiene toda la info de la oferta)
  const [selectedItem, setSelectedItem] = useState(null);

  // ID del item seleccionado (para marcar la card como seleccionada)
  const [selectedId, setSelectedId] = useState(null);

  /**
   * Abre el modal con la información del item seleccionado
   * @param {Object} item - Objeto con la información de la oferta
   */
  const handleOpen = (item) => {
    setSelectedItem(item);
    setSelectedId(item.id);
  };

  /**
   * Cierra el modal y limpia la selección
   */
  const handleClose = () => {
    setSelectedItem(null);
    setSelectedId(null);
  };

  return {
    selectedItem, // Item completo (null si no hay selección)
    selectedId, // ID del item (null si no hay selección)
    handleOpen, // Función para abrir modal
    handleClose, // Función para cerrar modal
  };
};
