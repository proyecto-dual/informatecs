"use client";
import { useState, useEffect } from "react";
import {
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Calendar,
  Award,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ConstanciaPDF } from "./Constancias";

export function ModalGenerar({ estudiante, onClose }) {
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState("");

  // Estados editables
  const [tipoAcreditacion, setTipoAcreditacion] = useState("Horas");
  const [cantidadAcreditacion, setCantidadAcreditacion] = useState("100");
  const [periodo, setPeriodo] = useState("Enero-Junio 2026");

  const [loading, setLoading] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [constanciaGenerada, setConstanciaGenerada] = useState(null);

  // EFECTO DE LIMPIEZA Y CARGA: Se activa al cambiar de estudiante
  useEffect(() => {
    if (estudiante?.aluctr) {
      // 1. Limpiar estados previos para que no se vea info del alumno anterior
      setActividades([]);
      setActividadSeleccionada("");
      setSuccess(false);
      setError("");
      setConstanciaGenerada(null);

      // 2. Cargar datos nuevos
      cargarActividadesAprobadas();
    }
  }, [estudiante]);

  const cargarActividadesAprobadas = async () => {
    setLoading(true);
    try {
      // 1. Buscamos inscripciones del alumno específico
      const res = await fetch(
        `/api/inscripciones?estudianteId=${estudiante.aluctr}`,
      );
      const data = await res.json();

      // Filtramos por estudianteId y calificación aprobatoria
      const aprobadas = data.filter(
        (i) =>
          i.estudianteId === estudiante.aluctr && (i.calificacion || 0) >= 70,
      );

      // 2. Buscamos constancias ya generadas para este alumno
      const resConst = await fetch(
        `/api/constancias?numeroControl=${estudiante.aluctr}`,
      );
      const constanciasExistentes = await resConst.json();
      const idsConConstancia = new Set(
        constanciasExistentes.map((c) => c.actividadId),
      );

      // 3. Dejamos solo las que NO tienen constancia
      const sinConstancia = aprobadas.filter(
        (i) => !idsConConstancia.has(i.actividadId),
      );

      setActividades(sinConstancia);

      if (sinConstancia.length === 0) {
        setError(
          `El alumno ${estudiante.alunom} no tiene actividades aprobadas pendientes.`,
        );
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerar = async () => {
    if (!actividadSeleccionada || !cantidadAcreditacion || !periodo) {
      setError("Completa todos los campos antes de continuar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const valorAcreditacion = `${cantidadAcreditacion} ${tipoAcreditacion}`;

      const response = await fetch("/api/constancias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroControl: estudiante.aluctr,
          actividadId: actividadSeleccionada,
          acreditacion: valorAcreditacion,
          periodo: periodo,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al generar");

      setConstanciaGenerada(data.constancia);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDF = async () => {
    setDescargando(true);
    try {
      const datosPDF = {
        ...constanciaGenerada,
        numeroControl: estudiante.aluctr,
        periodo: periodo,
      };

      const doc = <ConstanciaPDF datos={datosPDF} />;
      const blob = await pdf(doc).toBlob();
      saveAs(blob, `Constancia_${estudiante.aluctr}.pdf`);
    } catch (err) {
      setError("Error al generar el archivo PDF.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header con Logos */}
        <div className="bg-white border-b p-3 flex justify-between items-center px-6">
          <img src="/imagenes/educacionlogo.png" className="h-7" alt="SEP" />
          <img src="/imagenes/itelogo.png" className="h-9" alt="ITE" />
          <img src="/imagenes/tecnlogo.png" className="h-7" alt="TecNM" />
        </div>

        {/* Título dinámico según el alumno */}
        <div className="bg-slate-800 text-white p-5">
          <h2 className="text-lg font-bold">
            Generar para {estudiante.alunom}
          </h2>
          <p className="text-slate-400 text-sm">Control: {estudiante.aluctr}</p>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex gap-2 items-center">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="text-green-500 mx-auto" size={48} />
              <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                <p className="text-xs text-gray-500 uppercase font-bold">
                  Folio Asignado
                </p>
                <p className="text-xl font-mono font-bold text-blue-700">
                  {constanciaGenerada?.folio}
                </p>
              </div>
              <button
                onClick={handleDescargarPDF}
                disabled={descargando}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
              >
                {descargando ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                Descargar PDF
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 text-sm hover:text-gray-600"
              >
                Cerrar y volver a la lista
              </button>
            </div>
          ) : (
            <>
              {/* Formulario */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  ACTIVIDAD
                </label>
                <select
                  value={actividadSeleccionada}
                  onChange={(e) => setActividadSeleccionada(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm"
                  disabled={loading || actividades.length === 0}
                >
                  <option value="">Seleccione actividad...</option>
                  {actividades.map((insc) => (
                    <option key={insc.id} value={insc.actividadId}>
                      {insc.actividad?.acodes} (Cal: {insc.calificacion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">
                  PERIODO
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="w-full pl-10 p-2.5 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">
                    TIPO
                  </label>
                  <select
                    value={tipoAcreditacion}
                    onChange={(e) => setTipoAcreditacion(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  >
                    <option value="Horas">Horas</option>
                    <option value="Créditos">Créditos</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">
                    CANTIDAD
                  </label>
                  <input
                    type="text"
                    value={cantidadAcreditacion}
                    onChange={(e) => setCantidadAcreditacion(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerar}
                  disabled={loading || !actividadSeleccionada}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Award size={18} />
                  )}
                  Generar Constancia
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
