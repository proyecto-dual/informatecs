"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavbarMaestro from "@/app/components/layout/navbarmaestro";

export default function MaestrosLayout({ children }) {
  const [open, setOpen] = useState(true);

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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="maestros-layout-wrapper">
        <NavbarMaestro open={open} setOpen={setOpen} />

        <main
          className={`maestros-main-content ${open ? "sidebar-open" : "sidebar-closed"}`}
        >
          {children}
        </main>
      </div>

      <style jsx>{`
        .maestros-layout-wrapper {
          display: flex;
          min-height: 100vh;
        }

        .maestros-main-content {
          flex: 1;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
          overflow-x: hidden;
          background-color: #f4f7f6;
        }

        /* DESKTOP: sidebar lateral */
        @media (min-width: 769px) {
          .sidebar-open {
            margin-left: 280px;
          }
          .sidebar-closed {
            margin-left: 80px;
          }
        }

        /* MÓVIL: navbar top bar, sin margen lateral */
        @media (max-width: 768px) {
          .maestros-main-content {
            margin-left: 0 !important;
            padding-top: 80px;
          }
        }
      `}</style>
    </QueryClientProvider>
  );
}
