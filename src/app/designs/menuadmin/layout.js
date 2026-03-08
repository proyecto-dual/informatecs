"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminSidebar from "@/app/components/layout/navbaradm";

export default function EstudiantesLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout-wrapper">
        <AdminSidebar open={open} setOpen={setOpen} />

        <main
          className={`main-content ${open ? "sidebar-open" : "sidebar-closed"}`}
        >
          {children}
        </main>
      </div>

      <style jsx>{`
        .layout-wrapper {
          display: flex;
          min-height: 100vh;
          /* Evita scroll horizontal en toda la página */
          overflow-x: hidden;
        }

        .main-content {
          flex: 1;
          min-width: 0; /* ← clave: evita que flex desborde */
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 20px;
          background-color: #f4f7f6;
          /* Nunca más ancho que el espacio disponible */
          max-width: 100%;
          overflow-x: hidden;
        }

        /* ESCRITORIO */
        @media (min-width: 769px) {
          .sidebar-open {
            margin-left: 260px;
          }
          .sidebar-closed {
            margin-left: 75px;
          }
        }

        /* MÓVIL */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            margin-top: 60px;
            padding: 12px; /* menos padding en móvil */
          }
        }
      `}</style>
    </QueryClientProvider>
  );
}
