"use client";
import React from "react";
import { Download } from "lucide-react";

export const StatCard = ({ icon, title, value, subtitle, color }) => (
  <div className="intramuros-stat-card">
    <div className="intramuros-stat-card__inner">
      <div
        className={`intramuros-stat-card__icon intramuros-stat-card__icon--${color}`}
      >
        {icon}
      </div>
      <div className="intramuros-stat-card__body">
        <div className="intramuros-stat-card__title">{title}</div>
        <div className="intramuros-stat-card__value">{value}</div>
        <div className="intramuros-stat-card__subtitle">{subtitle}</div>
      </div>
    </div>
  </div>
);

export const ReportCard = ({ icon, title, desc, count, color }) => (
  <button className={`intramuros-report-card intramuros-report-card--${color}`}>
    <div className="intramuros-report-card__header">
      {icon}
      <Download size={20} className="intramuros-report-card__download" />
    </div>
    <h3 className="intramuros-report-card__title">{title}</h3>
    <p className="intramuros-report-card__desc">{desc}</p>
    <div className="intramuros-report-card__count">{count} registros</div>
  </button>
);

/* Ejemplo de uso con el wrapper centrado:

<div className="intramuros-admin-wrapper">
  <div className="intramuros-admin-inner">

    <div className="intramuros-stat-grid">
      <StatCard icon={<Users size={22}/>} title="Atletas" value="27" subtitle="Personas únicas" color="blue" />
      <StatCard icon={<Trophy size={22}/>} title="Torneos" value="6"  subtitle="2 cerrados"       color="green" />
    </div>

    <div className="intramuros-report-grid">
      <ReportCard icon={<FileText size={28}/>} title="Reporte General" desc="Resumen completo" count={127} color="blue" />
      <ReportCard icon={<Medal size={28}/>}    title="Resultados"      desc="Partidos jugados" count={48}  color="green" />
    </div>

  </div>
</div>

*/

const AdminCards = { StatCard, ReportCard };
export default AdminCards;
