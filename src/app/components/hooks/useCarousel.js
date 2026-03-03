import { useRef } from "react";

/**
 * Hook para manejar la funcionalidad del carousel
 * @param {number} scrollAmount - Cantidad de píxeles a desplazar (default: 408)
 * @returns {Object} Ref y función para controlar el scroll del carousel
 */
export const useCarousel = (scrollAmount = 408) => {
  const carouselRef = useRef(null);

  /**
   * Desplaza el carousel hacia la izquierda o derecha
   * @param {string} direction - Dirección del scroll: 'left' o 'right'
   */
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const amount = direction === "left" ? -scrollAmount : scrollAmount;
      carouselRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }
  };

  return {
    carouselRef, // Ref para asignar al contenedor del carousel
    scrollCarousel, // Función para hacer scroll
  };
};

// Export por defecto también por si acaso
export default useCarousel;
