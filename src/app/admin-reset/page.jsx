import { Suspense } from "react";
import Adminreset from "../components/forms/Adminreset";

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
      <Adminreset />
    </Suspense>
  );
}
