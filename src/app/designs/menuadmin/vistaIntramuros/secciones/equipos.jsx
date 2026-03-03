"use client";
import React, { useState } from "react";
import { Shield, Printer, Star } from "lucide-react";
import "../css/seccionequipos.css";

const SeccionEquipos = ({ inscripciones, actividades }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  /* ── Agrupar equipos ── */
  const equiposMap = {};

  inscripciones
    .filter(
      (i) =>
        i.Nombre_Equipo &&
        i.Nombre_Equipo !== "Individual" &&
        i.Nombre_Equipo !== "N/A",
    )
    .forEach((i) => {
      const actividadInfo = actividades.find(
        (a) => String(a.ID_Actividad) === String(i.ID_Actividad),
      );
      const nombreActividad = actividadInfo
        ? actividadInfo.Nombre_Actividad
        : "Actividad " + i.ID_Actividad;
      const key = `${i.Nombre_Equipo}_${nombreActividad}`.toLowerCase().trim();

      if (!equiposMap[key]) {
        equiposMap[key] = {
          nombre: i.Nombre_Equipo,
          actividadNombre: nombreActividad,
          idActividad: i.ID_Actividad,
          integrantes: [],
          nombresUnicos: new Set(),
        };
      }

      const agregar = (nombreStr, esResponsable = false) => {
        if (!nombreStr || nombreStr === "N/A") return;
        const nombreLimpio = nombreStr.replace(/\((M|F)\)/gi, "").trim();
        const key2 = nombreLimpio.toLowerCase();
        if (!equiposMap[key].nombresUnicos.has(key2)) {
          equiposMap[key].nombresUnicos.add(key2);
          equiposMap[key].integrantes.push({
            nombre: nombreLimpio,
            rol: esResponsable ? "Capitán" : "Integrante",
          });
        }
      };

      agregar(i.Nombre, true);
      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        i.Nombres_Integrantes.split(/[,/\n]/).forEach((n) => agregar(n, false));
      }
    });

  let equipos = Object.values(equiposMap);
  if (searchTerm)
    equipos = equipos.filter((e) =>
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  if (selectedActivity)
    equipos = equipos.filter(
      (e) => String(e.idActividad) === String(selectedActivity),
    );

  return (
    <div className="eq-wrapper">
      {/* ── Header sin fondo ── */}
      <div className="eq-header eq-no-print">
        <div>
          <h2 className="eq-header__title">Equipos</h2>
          <button className="eq-btn-print" onClick={() => window.print()}>
            <Printer size={14} /> Imprimir PDF
          </button>
        </div>

        <div className="eq-filters">
          <input
            type="text"
            placeholder="Buscar equipo..."
            className="eq-search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="eq-select"
            onChange={(e) => setSelectedActivity(e.target.value)}
          >
            <option value="">Todas las disciplinas</option>
            {actividades.map((a, idx) => (
              <option key={idx} value={a.ID_Actividad}>
                {a.Nombre_Actividad}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid de equipos ── */}
      <div className="eq-grid">
        {equipos.map((equipo, idx) => (
          <div key={idx} className="eq-card">
            <div className="eq-card__body">
              {/* Cabecera de la card */}
              <div className="eq-card__head">
                <div className="eq-card__icon-wrap eq-no-print">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="eq-card__name">{equipo.nombre}</h3>
                  <p className="eq-card__actividad">{equipo.actividadNombre}</p>
                </div>
              </div>

              {/* Plantilla */}
              <div className="eq-card__roster">
                <p className="eq-card__roster-label">Plantilla Oficial</p>
                {equipo.integrantes.map((int, i) => (
                  <div key={i} className="eq-card__member">
                    <span
                      className={`eq-card__member-name ${int.rol === "Capitán" ? "eq-card__member-name--cap" : "eq-card__member-name--int"}`}
                    >
                      {int.rol === "Capitán" ? (
                        <Star
                          size={10}
                          className="eq-card__cap-icon"
                          style={{ display: "inline", verticalAlign: "middle" }}
                        />
                      ) : (
                        "· "
                      )}
                      {int.nombre}
                    </span>
                    {int.rol === "Capitán" && (
                      <span className="eq-card__cap-badge">Capitán</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeccionEquipos;
