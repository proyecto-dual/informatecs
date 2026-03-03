"use client";

import { Inter } from "next/font/google";
import "./global.css";
import Navbar from "./components/layout/navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Agregamos "menuestu" a la lista de rutas que NO deben llevar Navbar horizontal
  const rutasSinNavbar = [
    "/designs/vistaLogin",
    "/designs/menuestu",
    "/designs/menuadmin",
    "/designs/menumaestros", // Esto cubrirá misConstancias y cualquier otra sub-ruta
  ];

  // Usamos .some y .startsWith para capturar todas las sub-rutas
  const ocultarNavbar = rutasSinNavbar.some((ruta) =>
    pathname.startsWith(ruta),
  );

  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Si no es login ni panel de usuario, muestra la Navbar horizontal */}
        {!ocultarNavbar && <Navbar />}

        <main>{children}</main>
      </body>
    </html>
  );
}
