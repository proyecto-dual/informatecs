"use client";
import React, { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import AdminSidebar from "@/app/components/layout/navbaradm";

const AlumnosPanel = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/estudiantes");
      if (response.ok) {
        const data = await response.json();
        setEstudiantes(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const nombreCompleto = `${est.alunom || ""} ${est.aluapp || ""} ${
      est.aluapm || ""
    }`.toLowerCase();
    const numControl = (est.aluctr || "").toLowerCase();
    const termino = busqueda.toLowerCase();
    return nombreCompleto.includes(termino) || numControl.includes(termino);
  });

  if (loading) {
    return <div className="text-center py-8">Cargando estudiantes...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 sticky top-0 h-screen bg-white shadow-md">
        <AdminSidebar />
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Lista de Alumnos
          </h2>
          <p className="text-gray-600">
            Total de estudiantes registrados: {estudiantes.length}
          </p>
        </div>

        {/* Buscador */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o número de control..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <h4 className="font-semibold">Total Estudiantes</h4>
            <p className="text-2xl font-bold">{estudiantes.length}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg">
            <h4 className="font-semibold">Resultados Búsqueda</h4>
            <p className="text-2xl font-bold">{estudiantesFiltrados.length}</p>
          </div>
        </div>

        {/* Tabla de estudiantes */}
        <div className="bg-white rounded-lg shadow-md overflow-auto">
          {estudiantesFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No se encontraron estudiantes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      No. Control
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nombre Completo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Carrera
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estudiantesFiltrados.map((estudiante) => {
                    const nombreCompleto = `${estudiante.alunom || ""} ${
                      estudiante.aluapp || ""
                    } ${estudiante.aluapm || ""}`.trim();

                    return (
                      <tr key={estudiante.aluctr} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {estudiante.aluctr}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {nombreCompleto || "Sin nombre"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {estudiante.carrera || "Sin carrera"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumnosPanel;
