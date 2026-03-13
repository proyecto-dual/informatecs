"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Extraer el token de la URL
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  // Validar si el token existe al cargar
  useEffect(() => {
    if (!token) {
      setStatus({ type: "error", msg: "Enlace inválido o sin token." });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      // IMPORTANTE: La URL debe coincidir EXACTAMENTE con el nombre de tu carpeta en api
      const res = await fetch("/api/auth/adminReset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          msg: "¡Contraseña actualizada! Redirigiendo...",
        });
        setTimeout(() => router.push("/admin/login"), 3000);
      } else {
        setStatus({
          type: "error",
          msg: data.message || "Error al actualizar.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Error de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="text-center text-2xl font-bold text-slate-800">
          🔐 Eventos ITE
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          Restablece tu contraseña
        </p>

        {status.msg && (
          <div
            className={`mb-4 rounded-lg p-3 text-sm font-medium ${
              status.type === "error"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-green-50 text-green-600 border border-green-200"
            }`}
          >
            {status.type === "error" ? "❌ " : "✅ "} {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña (min. 6 caracteres)"
            className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={!token || loading}
          />
          <button
            type="submit"
            disabled={!token || loading || password.length < 6}
            className="w-full rounded-lg bg-blue-700 p-3 font-bold text-white transition-opacity hover:opacity-90 disabled:bg-slate-300"
          >
            {loading ? "Procesando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Next.js requiere Suspense para usar useSearchParams en componentes cliente
export default function AdminResetPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetForm />
    </Suspense>
  );
}
