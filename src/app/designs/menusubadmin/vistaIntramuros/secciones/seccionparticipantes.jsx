"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, FileDown } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

import "../css/seccionparticipantes.css";
import { CedulaPDF } from "@/app/components/CedulaImpresion";

const SeccionParticipantes = ({ inscripciones }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroGenero, setFiltroGenero] = useState("Todos");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- TU LÓGICA ORIGINAL COMPLETA ---
  const { filtrados, estadisticas } = useMemo(() => {
    const mapaUnico = new Map();
    const DOMINIO_INST = "@ite.edu.mx";
    if (!inscripciones) return { filtrados: [], estadisticas: {} };

    inscripciones.forEach((i) => {
      const actividadActual = i.Nombre_Actividad || "Sin Actividad";
      const equipoActual = i.Nombre_Equipo || "Individual";

      const procesarPersona = (nombre, correo, sexo, esCapitan) => {
        if (
          !nombre ||
          nombre.trim() === "" ||
          nombre === "N/A" ||
          nombre === "NOMBRE"
        )
          return;
        const nombreLimpio = nombre.replace(/\((M|F)\)/gi, "").trim();
        const gen =
          sexo === "M" || nombre.includes("(M)")
            ? "M"
            : sexo === "F" || nombre.includes("(F)")
              ? "F"
              : "N/R";
        const esInst = (correo || "").toLowerCase().endsWith(DOMINIO_INST);
        const llave = `${nombreLimpio.toLowerCase()}-${actividadActual.toLowerCase()}`;

        if (!mapaUnico.has(llave)) {
          mapaUnico.set(llave, {
            nombre: nombreLimpio,
            actividad: actividadActual,
            equipo: equipoActual,
            tipo: esInst ? "ITE" : "EXT",
            esExterno: !esInst,
            genero: gen,
            rol: esCapitan
              ? equipoActual !== "Individual"
                ? "Capitán"
                : "Individual"
              : "Integrante",
          });
        }
      };

      procesarPersona(i.Nombre, i.Email, i.Sexo, true);
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach((nom) =>
          procesarPersona(nom, "", "", false),
        );
      }
    });

    const listado = Array.from(mapaUnico.values()).filter((p) => {
      const busqueda = searchTerm.toLowerCase();
      const coincide =
        p.nombre.toLowerCase().includes(busqueda) ||
        p.equipo.toLowerCase().includes(busqueda) ||
        p.actividad.toLowerCase().includes(busqueda);
      const cumpleTipo =
        filtroTipo === "Todos" ||
        (filtroTipo === "Interno" ? !p.esExterno : p.esExterno);
      const cumpleGen = filtroGenero === "Todos" || p.genero === filtroGenero;
      return coincide && cumpleTipo && cumpleGen;
    });

    return {
      filtrados: listado,
      estadisticas: {
        total: listado.length,
        h: listado.filter((p) => p.genero === "M").length,
        m: listado.filter((p) => p.genero === "F").length,
        ite: listado.filter((p) => !p.esExterno).length,
        ext: listado.filter((p) => p.esExterno).length,
      },
    };
  }, [inscripciones, searchTerm, filtroTipo, filtroGenero]);

  return (
    <div className="sp-wrapper">
      <div className="sp-filters sp-no-print">
        <div className="sp-search-wrap">
          <Search className="sp-search-icon" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o torneo..."
            className="sp-search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sp-filter-controls">
          <select
            className="sp-select"
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="Todos">ITE / EXT</option>
            <option value="Interno">Solo ITE</option>
            <option value="Externo">Solo Externos</option>
          </select>
          <select
            className="sp-select"
            onChange={(e) => setFiltroGenero(e.target.value)}
          >
            <option value="Todos">Género</option>
            <option value="M">Masc</option>
            <option value="F">Fem</option>
          </select>

          {isClient && (
            <PDFDownloadLink
              document={<CedulaPDF filtrados={filtrados} />}
              fileName={`Cedula_${new Date().getTime()}.pdf`}
              className="sp-btn-print"
            >
              {({ loading }) => (
                <>
                  <FileDown size={15} />
                  {loading ? "Generando..." : "Descargar PDF"}
                </>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className="sp-stats-grid sp-no-print">
        <div className="sp-stat-card">
          <span className="sp-stat-label">Total</span>
          <span className="sp-stat-value">{estadisticas.total}</span>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-label sp-stat-label--blue">Hombres</span>
          <span className="sp-stat-value">{estadisticas.h}</span>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-label sp-stat-label--pink">Mujeres</span>
          <span className="sp-stat-value">{estadisticas.m}</span>
        </div>
        <div className="sp-stat-card sp-stat-card--ite">
          <span className="sp-stat-label">Alumnos ITE</span>
          <span className="sp-stat-value">{estadisticas.ite}</span>
        </div>
        <div className="sp-stat-card sp-stat-card--ext">
          <span className="sp-stat-label">Externos</span>
          <span className="sp-stat-value">{estadisticas.ext}</span>
        </div>
      </div>

      <div className="sp-print-container">
        <table className="sp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre del Atleta</th>
              <th>Actividad</th>
              <th>Equipo / Rol</th>
              <th>G</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, idx) => (
              <tr key={idx}>
                <td className="sp-td-num">{idx + 1}</td>
                <td className="sp-td-nombre">{p.nombre}</td>
                <td className="sp-td-actividad">{p.actividad}</td>
                <td>
                  <span className="sp-td-equipo">{p.equipo}</span>
                  <span className="sp-td-rol"> ({p.rol})</span>
                </td>
                <td className="sp-center">{p.genero}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeccionParticipantes;
