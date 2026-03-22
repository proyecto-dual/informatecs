"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check,
  RefreshCw,
  FileUp,
  AlertCircle,
  Clock,
  X,
  MessageCircle,
} from "lucide-react";

const BloodTypeValidator = ({ numeroControl, onUploadSuccess }) => {
  const [bloodType, setBloodType] = useState("");
  const [bloodTypeFile, setBloodTypeFile] = useState(null);
  const [bloodTypeFileName, setBloodTypeFileName] = useState("");
  const [currentBloodType, setCurrentBloodType] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [mensajeAdmin, setMensajeAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const intervalRef = useRef(null);

  const cargarTipoSangre = useCallback(async () => {
    if (!numeroControl) return;
    try {
      const response = await fetch(`/api/sangre?aluctr=${numeroControl}`);
      if (!response.ok) return;

      const data = await response.json();
      console.log("DATA SANGRE:", JSON.stringify(data, null, 2)); // ← aquí
      setCurrentBloodType(data?.estudiante?.alutsa || null);
      setPendingRequest(data?.solicitudPendiente || null);

      // Solo mostrar mensajeAdmin si la inscripción NO está validada
      // Si sangreValidada es true, el mensaje es de aprobación, no de rechazo
      const insc = data?.inscripcion;
      const estaValidada = insc?.sangreValidada === true;
      setMensajeAdmin(!estaValidada ? insc?.mensajeAdmin || null : null);

      if (data?.estudiante?.alutsa && !data?.solicitudPendiente) {
        setIsUpdating(false);
      }
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }, [numeroControl]);

  useEffect(() => {
    cargarTipoSangre();
    if (!showModal) {
      intervalRef.current = setInterval(cargarTipoSangre, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cargarTipoSangre, showModal]);

  const handleSubmit = async () => {
    if (!bloodType || !bloodTypeFile)
      return alert("Selecciona tipo y archivo.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("aluctr", numeroControl);
      formData.append("bloodType", bloodType);
      formData.append("file", bloodTypeFile);

      const response = await fetch("/api/sangre", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error");

      setShowModal(false);
      setIsUpdating(false);
      setBloodTypeFile(null);
      setBloodTypeFileName("");
      setBloodType("");

      await cargarTipoSangre();
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      alert("Error al subir archivo.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE RENDERIZADO (JERARQUÍA DE PRIORIDAD) ---

  // 1. PRIORIDAD MÁXIMA: RECHAZO O EDICIÓN (Banner Rojo)
  // Si hay un mensaje de admin, significa que lo último que pasó fue un rechazo.
  // Esto debe mostrarse aunque exista un 'currentBloodType' antiguo.
  if ((mensajeAdmin && !pendingRequest) || isUpdating) {
    return (
      <>
        <div className="bg-white border-4 border-dashed border-red-200 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-xl shadow-red-50 mb-6 transition-all animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-red-50 p-5 rounded-3xl text-red-500 shadow-inner">
                <AlertCircle size={40} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl leading-tight">
                  {mensajeAdmin
                    ? "Documento Rechazado"
                    : "Actualización de Sangre"}
                </h3>
                <p className="text-sm font-bold text-red-500 mt-1 italic">
                  {mensajeAdmin
                    ? "Tu envío previo fue rechazado. Revisa el motivo abajo."
                    : "Sube tu nuevo comprobante oficial."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-red-600 text-white px-10 py-5 rounded-[20px] font-black hover:bg-red-700 shadow-xl shadow-red-200 transition-all flex items-center gap-3 w-full md:w-auto justify-center"
            >
              <FileUp size={22} />{" "}
              {mensajeAdmin ? "CORREGIR AHORA" : "SUBIR DOCUMENTO"}
            </button>
          </div>

          {mensajeAdmin && (
            <div className="bg-red-50/50 border-2 border-red-100 p-4 rounded-2xl flex items-start gap-3">
              <MessageCircle className="text-red-400 mt-1" size={18} />
              <div>
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                  Motivo del rechazo:
                </p>
                <p className="text-sm font-bold text-red-700">
                  "{mensajeAdmin}"
                </p>
              </div>
            </div>
          )}
        </div>
        {renderModal()}
      </>
    );
  }

  // 2. SEGUNDA PRIORIDAD: PENDIENTE (Banner Naranja)
  // Si el alumno ya subió algo y está esperando.
  if (pendingRequest) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex justify-between items-center mb-6 shadow-sm animate-pulse">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-2xl text-white">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">
              Validación en Proceso
            </h3>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              El administrador está revisando tu documento...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. TERCERA PRIORIDAD: VALIDADO (Banner Verde)
  // Solo se muestra si no hay rechazos, no está editando y no hay pendientes.
  if (currentBloodType) {
    return (
      <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-[2rem] flex justify-between items-center mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg">
            <Check size={24} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">
              Tipo de Sangre: {currentBloodType}
            </h3>
            <p className="text-xs font-bold text-emerald-600 uppercase">
              Validado Oficialmente
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsUpdating(true)}
          className="bg-white border-2 border-emerald-100 text-emerald-600 px-5 py-2.5 rounded-xl font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
        >
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>
    );
  }

  // 4. ESTADO INICIAL: NADA REGISTRADO (Banner Rojo)
  return (
    <>
      <div className="bg-white border-4 border-dashed border-slate-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-slate-50 mb-6">
        <div className="flex items-center gap-5">
          <div className="bg-slate-100 p-5 rounded-3xl text-slate-400">
            <AlertCircle size={40} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-xl">
              Sin Comprobante
            </h3>
            <p className="text-sm font-bold text-slate-400 italic">
              Sube tu documento para validar tu tipo de sangre.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-10 py-5 rounded-[20px] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-3"
        >
          <FileUp size={22} /> SUBIR AHORA
        </button>
      </div>
      {renderModal()}
    </>
  );

  // Función interna para el modal (para no repetir código)
  function renderModal() {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
        <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-xl">
              Cargar Documento
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-slate-200 rounded-full"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>
          <div className="p-8 space-y-6">
            <select
              className="w-full p-4 border-2 border-slate-100 rounded-2xl font-black text-slate-700 bg-slate-50 outline-none"
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
            >
              <option value="">Selecciona Tipo de Sangre...</option>
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="relative border-4 border-dashed border-slate-100 rounded-[24px] p-10 text-center bg-slate-50/50 hover:border-blue-400 transition-all group">
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setBloodTypeFile(f);
                    setBloodTypeFileName(f.name);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FileUp className="text-blue-500 mx-auto mb-2" size={32} />
              <span className="text-sm font-black text-slate-600 block truncate">
                {bloodTypeFileName || "Clic para seleccionar archivo"}
              </span>
            </div>
          </div>
          <div className="p-8 border-t flex gap-4 bg-slate-50/50">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 font-black text-slate-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !bloodType || !bloodTypeFile}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="animate-spin mx-auto" />
              ) : (
                "Confirmar Envío"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default BloodTypeValidator;
