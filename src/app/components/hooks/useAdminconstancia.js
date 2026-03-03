import { useState, useEffect } from "react";
import { ConstanciaService } from "../service/constanciaservice";
// Importante: La ruta apunta a la carpeta services que creamos arriba

export const useAdminConstancias = () => {
  const [estudiantes, setEstudiantes] = useState([]); // Inicializado como array vacío
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/inscripciones", { cache: 'no-store' });
      const data = await res.json();
      const procesados = ConstanciaService.procesarListaEstudiantes(data);
      setEstudiantes(procesados);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setEstudiantes([]); // Evita que quede como undefined si falla la API
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  return { estudiantes, loading, refrescar: cargarDatos };
};