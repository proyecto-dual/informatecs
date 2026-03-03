"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavbarMaestro from "@/app/components/layout/navbarmaestro";

export default function EstudiantesLayout({ children }) {
  // El estado 'open' vive aquí para que afecte a NavbarMaestro Y al main
  const [open, setOpen] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout-wrapper">
        {/* Pasamos 'open' y 'setOpen' correctamente al componente */}
        <NavbarMaestro open={open} setOpen={setOpen} />

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
          /* Transición sincronizada con el navbar (0.3s) */
          transition: margin-left 0.3s ease;
          padding: 20px;
          background-color: #f4f7f6;
        }

        /* ESCRITORIO: Ajuste de márgenes según los nuevos anchos */
        @media (min-width: 769px) {
          .sidebar-open {
            margin-left: 280px; /* Coincide con .navbarmaestro.open */
          }
          .sidebar-closed {
            margin-left: 80px; /* Coincide con .navbarmaestro.closed */
          }
        }

        /* MÓVIL: Sin margen lateral */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding-top: 80px; /* Espacio para el botón hamburguesa móvil */
          }
        }
      `}</style>
    </QueryClientProvider>
  );
}
