"use client";

import { useState } from "react";
import SidebarEstudiante from "@/app/components/layout/navbares";
// 1. Importamos las herramientas de TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function EstudiantesLayout({ children }) {
  const [open, setOpen] = useState(true);

  // 2. Inicializamos el QueryClient dentro de un estado para que sea persistente
  // Esto evita que se pierda la caché al navegar entre páginas
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Los datos se consideran frescos por 1 minuto
            refetchOnWindowFocus: false, // Evita recargas innecesarias al cambiar de pestaña
          },
        },
      }),
  );

  return (
    // 3. Envolvemos toda la estructura con el Provider
    <QueryClientProvider client={queryClient}>
      <div className="estudiantes-layout">
        <SidebarEstudiante open={open} setOpen={setOpen} />

        <main
          className="content-area"
          style={{
            marginLeft: open ? "260px" : "75px",
            transition: "margin 0.3s ease, width 0.3s ease",
            width: open ? "calc(100% - 260px)" : "calc(100% - 75px)",
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </QueryClientProvider>
  );
}
