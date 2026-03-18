"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SubAdminSidebar from "@/app/components/layout/navbarsubadm";

export default function SubAdminLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="layout-wrapper">
        <SubAdminSidebar open={open} setOpen={setOpen} />
        <main className={`main-content ${open ? "sidebar-open" : "sidebar-closed"}`}>
          {children}
        </main>
      </div>
      <style jsx>{`
        .layout-wrapper { display: flex; min-height: 100vh; overflow-x: hidden; }
        .main-content { flex: 1; min-width: 0; transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1); padding: 20px; background-color: #f4f7f6; max-width: 100%; overflow-x: hidden; }
        @media (min-width: 769px) { .sidebar-open { margin-left: 260px; } .sidebar-closed { margin-left: 75px; } }
        @media (max-width: 768px) { .main-content { margin-left: 0 !important; margin-top: 60px; padding: 12px; } }
      `}</style>
    </QueryClientProvider>
  );
}