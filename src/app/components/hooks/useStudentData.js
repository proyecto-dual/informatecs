import { useState, useEffect } from "react";

/**
 * Hook para manejar los datos del estudiante desde localStorage
 * @returns {Object} studentData - Datos del estudiante
 * @returns {Function} updateStudentData - Función para actualizar datos
 */
export const useStudentData = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem("studentData");
    if (savedData) {
      try {
        setStudentData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error al parsear datos del estudiante:", error);
      }
    }
  }, []);

  const updateStudentData = (newData) => {
    const updatedData = { ...studentData, ...newData };
    setStudentData(updatedData);
    localStorage.setItem("studentData", JSON.stringify(updatedData));
  };

  return { studentData, updateStudentData };
};
