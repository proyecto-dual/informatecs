"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminSidebar from "@/app/components/layout/navbaradm";

export default function EstudiantesLayout({ children }) {
  // El estado 'open' vive aquí para que afecte a AdminSidebar Y al main
  const [open, setOpen] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout-wrapper">
        {/* Le pasamos el estado y la función para cambiarlo al Sidebar */}
        <AdminSidebar open={open} setOpen={setOpen} />

        {/* El MAIN usa clases dinámicas según el estado 'open' */}
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
        }

        .main-content {
          flex: 1;
          /* Esta transición debe ser igual a la del navbar (0.3s) */
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 20px;
          background-color: #f4f7f6;
        }

        /* ESCRITORIO: Ajuste de márgenes */
        @media (min-width: 769px) {
          .sidebar-open {
            margin-left: 260px; /* Ancho del navbar abierto */
          }
          .sidebar-closed {
            margin-left: 75px; /* Ancho del navbar cerrado */
          }
        }

        /* MÓVIL: Sin margen lateral */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            margin-top: 60px; /* Espacio para el header fijo móvil */
          }
        }
      `}</style>
    </QueryClientProvider>
  );
}
