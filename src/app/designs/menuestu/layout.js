"use client";

import { useState, useEffect } from "react";
import SidebarEstudiante from "@/app/components/layout/navbares";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function EstudiantesLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta si es móvil (≤768px) y actualiza al cambiar el tamaño
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check(); // revisar al montar
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // En móvil: sin margin ni width calculado — el navbar es top bar de 60px
  // En desktop: sidebar lateral fijo, desplazamos el contenido
  const mainStyle = isMobile
    ? {
        marginLeft: 0,
        width: "100%",
        minWidth: 0,
        overflowX: "hidden",
      }
    : {
        marginLeft: open ? "260px" : "75px",
        width: open ? "calc(100% - 260px)" : "calc(100% - 75px)",
        transition:
          "margin 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)",
        minWidth: 0,
        overflowX: "hidden",
      };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="estudiantes-layout">
        <SidebarEstudiante open={open} setOpen={setOpen} />
        <main className="content-area" style={mainStyle}>
          {children}
        </main>
      </div>
    </QueryClientProvider>
  );
}
