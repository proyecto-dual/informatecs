// src/app/admin-approval/page.jsx
import { Suspense } from "react";
import AdminApproval from "../components/forms/AdminApproval";
import AdminApprovalPage from "../components/forms/AdminApproval";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg,#1b396a,#2e5fa3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          Cargando...
        </div>
      }
    >
      <AdminApprovalPage />
    </Suspense>
  );
}
