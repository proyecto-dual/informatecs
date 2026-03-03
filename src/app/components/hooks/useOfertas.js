"use client";
import { useState, useEffect } from "react";

/**
 * Hook para cargar y manejar ofertas de actividades
 * @param {string} apiUrl - URL del endpoint de ofertas
 * @returns {Object} ofertas - Array de ofertas disponibles
 * @returns {boolean} loading - Estado de carga
 * @returns {string|null} error - Mensaje de error si existe
 * @returns {Function} refetch - Función para recargar ofertas
 */
export const useOfertas = (apiUrl = "/api/act-disponibles") => {
  // Estado de ofertas
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar ofertas
  const cargarOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error("Error al cargar ofertas");
      }

      const data = await res.json();
      setOfertas(Array.isArray(data) ? data : data.ofertas || []);
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ofertas al montar el componente
  useEffect(() => {
    cargarOfertas();
  }, [apiUrl]);

  return {
    ofertas,
    loading,
    error,
    refetch: cargarOfertas,
  };
};
