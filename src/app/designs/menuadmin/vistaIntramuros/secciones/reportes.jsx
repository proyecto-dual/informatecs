"use client";
import React from "react";
import { Calendar, Swords, Users, Globe, GraduationCap } from "lucide-react";
import { ReportCard } from "../componentesintra/admincards";
import "../css/seccionreportes.css";

const SeccionReportes = ({ actividades, resultados, inscripciones }) => {
  const calcularMetricasReales = () => {
    const nombresUnicos = new Set();
    let internos = 0;
    let externos = 0;
    const DOMINIO_INST = "@ite.edu.mx";

    inscripciones.forEach((i) => {
      if (i.Nombre && i.Nombre.trim() !== "") {
        const nombreLimpio = i.Nombre.trim().toLowerCase();
        if (!nombresUnicos.has(nombreLimpio)) {
          nombresUnicos.add(nombreLimpio);
          const esInst = (i.Email || "").toLowerCase().endsWith(DOMINIO_INST);
          esInst ? internos++ : externos++;
        }
      }

      if (i.Nombres_Integrantes && i.Nombres_Integrantes !== "N/A") {
        const nombresExtra = i.Nombres_Integrantes.split(/[,/\n]/);
        const correosExtra = (i.Correos_Integrantes || "").split(/[,/\n]/);

        nombresExtra.forEach((nom, index) => {
          const nomTrim = nom.trim();
          if (
            nomTrim &&
            nomTrim !== "" &&
            !nombresUnicos.has(nomTrim.toLowerCase())
          ) {
            nombresUnicos.add(nomTrim.toLowerCase());
            const correoInt = (correosExtra[index] || "").toLowerCase().trim();
            correoInt.endsWith(DOMINIO_INST) ? internos++ : externos++;
          }
        });
      }
    });

    return { totalReal: nombresUnicos.size, internos, externos };
  };

  const metricas = calcularMetricasReales();
  const pctITE =
    metricas.totalReal > 0
      ? Math.round((metricas.internos / metricas.totalReal) * 100)
      : 0;
  const pctEXT =
    metricas.totalReal > 0
      ? Math.round((metricas.externos / metricas.totalReal) * 100)
      : 0;

  return (
    <div className="rp-wrapper">
      {/* ── Header sin fondo ── */}
      <div className="rp-header">
        <h2 className="rp-header__title">Centro de Reportes</h2>
        <p className="rp-header__sub">Datos procesados individualmente</p>
      </div>

      {/* ── ReportCards ── */}
      <div className="rp-grid-3">
        <ReportCard
          icon={<Calendar size={32} />}
          title="Torneos"
          desc="Disciplinas abiertas"
          count={actividades.length}
          color="blue"
        />
        <ReportCard
          icon={<Swords size={32} />}
          title="Partidos"
          desc="Resultados en tabla"
          count={resultados.length}
          color="green"
        />
        <ReportCard
          icon={<Users size={32} />}
          title="Personas Totales"
          desc="Capitanes + Miembros"
          count={metricas.totalReal}
          color="purple"
        />
      </div>

      {/* ── Desglose ITE / Externos ── */}
      <div className="rp-grid-2">
        {/* ITE */}
        <div className="rp-breakdown-card rp-breakdown-card--ite">
          <div className="rp-breakdown-card__left">
            <div className="rp-breakdown-card__icon rp-breakdown-card__icon--ite">
              <GraduationCap size={30} />
            </div>
            <div>
              <p className="rp-breakdown-card__value">{metricas.internos}</p>
              <p className="rp-breakdown-card__label">Estudiantes ITE</p>
            </div>
          </div>
          <span className="rp-pct-badge rp-pct-badge--ite">{pctITE}%</span>
        </div>

        {/* Externos */}
        <div className="rp-breakdown-card rp-breakdown-card--ext">
          <div className="rp-breakdown-card__left">
            <div className="rp-breakdown-card__icon rp-breakdown-card__icon--ext">
              <Globe size={30} />
            </div>
            <div>
              <p className="rp-breakdown-card__value">{metricas.externos}</p>
              <p className="rp-breakdown-card__label">Invitados Externos</p>
            </div>
          </div>
          <span className="rp-pct-badge rp-pct-badge--ext">{pctEXT}%</span>
        </div>
      </div>
    </div>
  );
};

export default SeccionReportes;
