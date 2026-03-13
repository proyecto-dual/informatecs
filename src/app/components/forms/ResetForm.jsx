"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Extraer el token de la URL (?token=...)
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  // Verificación inicial: Si no hay token en la URL, mostramos error de inmediato
  useEffect(() => {
    if (!token) {
      setStatus({
        type: "error",
        msg: "Enlace inválido. No se detectó un token de recuperación.",
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de seguridad en el cliente
    if (password !== confirmPassword) {
      return setStatus({ type: "error", msg: "Las contraseñas no coinciden." });
    }
    if (password.length < 6) {
      return setStatus({
        type: "error",
        msg: "La contraseña debe tener al menos 6 caracteres.",
      });
    }

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      // Llamada a tu API (Asegúrate de que la carpeta sea 'adminReset' exactamente)
      const res = await fetch("/api/auth/adminReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          msg: "¡Contraseña actualizada! Redirigiendo al login...",
        });
        // Redirigir después de 3 segundos
        setTimeout(() => router.push("/designs/vistaLogin"), 3000);
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Error al actualizar la contraseña.",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Error de conexión. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">🔐 Eventos ITE</h2>
          <p className="text-sm text-slate-500">
            Restablece tu contraseña de administrador
          </p>
        </div>

        {/* Alertas de Estado */}
        {status.msg && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm font-medium border ${
              status.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {status.type === "error" ? "❌ " : "✅ "} {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={!token || loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu nueva contraseña"
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!token || loading}
            />
          </div>

          <button
            type="submit"
            disabled={!token || loading || password.length < 6}
            className="w-full rounded-lg bg-blue-700 p-3 font-bold text-white transition-all hover:bg-blue-800 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </>
            ) : (
              "Actualizar Contraseña"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          <p>Esta acción es irreversible una vez completada.</p>
        </div>
      </div>
    </div>
  );
}

// Exportación principal envuelta en Suspense (Requisito de Next.js para useSearchParams)
export default function AdminResetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-medium">
          Cargando formulario...
        </div>
      }
    >
      <ResetForm />
    </Suspense>
  );
}
