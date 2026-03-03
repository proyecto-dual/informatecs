// app/designs/estudiante/debug-constancias/page.jsx
"use client";
import { useState, useEffect } from "react";
import { Bug, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function DebugConstancias() {
  const [info, setInfo] = useState({
    numeroControl: null,
    localStorage: {},
    sessionStorage: {},
    constanciasAPI: null,
    error: null,
  });

  useEffect(() => {
    diagnosticar();
  }, []);

  const diagnosticar = async () => {
    const diagnostic = {
      numeroControl: null,
      localStorage: {},
      sessionStorage: {},
      constanciasAPI: null,
      error: null,
    };

    // 1. Revisar localStorage
    try {
      diagnostic.localStorage = {
        numeroControl: localStorage.getItem("numeroControl"),
        aluctr: localStorage.getItem("aluctr"),
        studentData: localStorage.getItem("studentData"),
        allKeys: Object.keys(localStorage),
      };
    } catch (error) {
      diagnostic.error = "Error leyendo localStorage: " + error.message;
    }

    // 2. Revisar sessionStorage
    try {
      diagnostic.sessionStorage = {
        numeroControl: sessionStorage.getItem("numeroControl"),
        aluctr: sessionStorage.getItem("aluctr"),
        allKeys: Object.keys(sessionStorage),
      };
    } catch (error) {
      diagnostic.error = "Error leyendo sessionStorage: " + error.message;
    }

    // 3. Intentar obtener número de control
    let numControl = localStorage.getItem("numeroControl");

    if (!numControl) {
      try {
        const studentDataStr = localStorage.getItem("studentData");
        if (studentDataStr) {
          const studentData = JSON.parse(studentDataStr);
          numControl = studentData.numeroControl || studentData.aluctr;
        }
      } catch (error) {
        diagnostic.error = "Error parseando studentData: " + error.message;
      }
    }

    if (!numControl) {
      numControl = sessionStorage.getItem("numeroControl");
    }

    if (!numControl) {
      numControl = localStorage.getItem("aluctr");
    }

    diagnostic.numeroControl = numControl;

    // 4. Probar API con el número de control
    if (numControl) {
      try {
        const response = await fetch(
          `/api/constancias?numeroControl=${numControl}`,
        );
        const data = await response.json();
        diagnostic.constanciasAPI = {
          status: response.status,
          ok: response.ok,
          data: data,
          count: Array.isArray(data) ? data.length : 0,
        };
      } catch (error) {
        diagnostic.constanciasAPI = {
          error: error.message,
        };
      }
    }

    setInfo(diagnostic);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3">
            <Bug className="text-purple-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Debug - Constancias
              </h1>
              <p className="text-gray-600">Diagnóstico de sesión y API</p>
            </div>
          </div>
        </div>

        {/* Número de Control */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {info.numeroControl ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            Número de Control Detectado
          </h2>
          {info.numeroControl ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <p className="font-mono text-2xl text-green-800">
                {info.numeroControl}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <p className="text-red-800">
                ❌ No se encontró número de control
              </p>
            </div>
          )}
        </div>

        {/* localStorage */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">localStorage</h2>
          <div className="bg-gray-50 rounded p-4 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(info.localStorage, null, 2)}
            </pre>
          </div>
        </div>

        {/* sessionStorage */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">sessionStorage</h2>
          <div className="bg-gray-50 rounded p-4 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(info.sessionStorage, null, 2)}
            </pre>
          </div>
        </div>

        {/* API Response */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {info.constanciasAPI?.ok ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-yellow-600" size={24} />
            )}
            Respuesta de API
          </h2>
          {info.constanciasAPI ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800">
                  <strong>Status:</strong> {info.constanciasAPI.status}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>OK:</strong> {info.constanciasAPI.ok ? "✅" : "❌"}
                </p>
                {info.constanciasAPI.count !== undefined && (
                  <p className="text-sm text-blue-800">
                    <strong>Constancias encontradas:</strong>{" "}
                    {info.constanciasAPI.count}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 rounded p-4 overflow-auto max-h-96">
                <pre className="text-xs">
                  {JSON.stringify(info.constanciasAPI.data, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              No se pudo consultar la API (sin número de control)
            </p>
          )}
        </div>

        {/* Errores */}
        {info.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-800">Errores</h2>
            <p className="text-red-700">{info.error}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Acciones</h2>
          <div className="flex gap-4">
            <button
              onClick={diagnosticar}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              🔄 Volver a diagnosticar
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert("Storage limpiado. Refresca la página.");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🗑️ Limpiar storage
            </button>
            <a
              href="/designs/estudiante/constancias"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ← Volver a Constancias
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
