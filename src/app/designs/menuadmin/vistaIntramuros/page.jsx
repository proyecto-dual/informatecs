"use client";
import React, { useState, useEffect } from "react";
import {
  Trophy,
  RefreshCw,
  BarChart3,
  Calendar,
  Swords,
  Shield,
  Award,
  Users,
  FileText,
  Plus,
  Clock,
} from "lucide-react";

import SeccionPartidos from "./secciones/seccionpartidos";
import SeccionEquipos from "./secciones/equipos";
import SeccionRankings from "./secciones/seccionracking";
import SeccionParticipantes from "./secciones/seccionparticipantes";
import SeccionReportes from "./secciones/reportes";
import SectionActividades from "./secciones/seccionactividades";
import Dashboard from "./componentesintra/dashboard";
import AdminPublicador from "./componentesintra/intramurospublicador";
import EditModal from "./componentesintra/editmodal";
import SeccionCronologia from "./seccioncronologia"; // Asegúrate de que el archivo se llame así

import "./css/intramuroscard.css";
import "./css/intamurospanel.css";

const WEB_APP_URL = "/api/intramuros";

const TABS = [
  { id: "dashboard", icon: <BarChart3 size={18} />, label: "Dashboard" },
  { id: "actividades", icon: <Calendar size={18} />, label: "Torneos" },
  { id: "cronologia", icon: <Clock size={18} />, label: "Cronología" }, // Pestaña activada
  { id: "partidos", icon: <Swords size={18} />, label: "Partidos" },
  { id: "equipos", icon: <Shield size={18} />, label: "Equipos" },
  { id: "rankings", icon: <Award size={18} />, label: "Rankings" },
  { id: "participantes", icon: <Users size={18} />, label: "Participantes" },
  { id: "reportes", icon: <FileText size={18} />, label: "Reportes" },
  { id: "nueva", icon: <Plus size={18} />, label: "Nueva" },
];

const IntramurosPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    actividades: [],
    resultados: [],
    inscripciones: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const fetchPath = (h) =>
        fetch(`${WEB_APP_URL}?hoja=${h}`).then((r) => r.json());
      const [actData, resData, inscribe, externos, inst] = await Promise.all([
        fetchPath("lista"),
        fetchPath("partidos"),
        fetchPath("inscribe"),
        fetchPath("inscribe_externos"),
        fetchPath("inscribe_institucional"),
      ]);
      setData({
        actividades: actData.data || [],
        resultados: resData.data || [],
        inscripciones: [
          ...(inscribe.data || []),
          ...(externos.data || []),
          ...(inst.data || []),
        ],
      });
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
    setLoading(false);
  };

  const siguienteID =
    data.actividades.length > 0
      ? Math.max(
          ...data.actividades.map((a) => parseInt(a.ID_Actividad || 0)),
        ) + 1
      : 1;

  return (
    <div className="ip-root">
      <header className="ip-header">
        <div className="ip-header__brand">
          <div className="ip-header__icon">
            <Trophy size={24} />
          </div>
          <h1 className="ip-header__title">Actividades Intramuros</h1>
        </div>
        <button
          className={`ip-btn-refresh ${loading ? "ip-btn-refresh--spinning" : ""}`}
          onClick={loadAllData}
        >
          <RefreshCw size={18} />
        </button>
      </header>

      <nav className="ip-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`ip-nav__tab ${activeTab === tab.id ? "ip-nav__tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span className="ip-nav__label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="ip-main">
        {activeTab === "dashboard" && <Dashboard {...data} />}

        {activeTab === "cronologia" && (
          <SeccionCronologia
            resultados={data.resultados}
            actividades={data.actividades}
          />
        )}

        {activeTab === "actividades" && (
          <SectionActividades
            data={data.actividades}
            inscripciones={data.inscripciones}
            onEdit={(a) => {
              setEditingActivity(a);
              setShowEditModal(true);
            }}
            onNew={() => setActiveTab("nueva")}
          />
        )}
        {activeTab === "partidos" && (
          <SeccionPartidos
            actividades={data.actividades}
            resultados={data.resultados}
            onRefresh={loadAllData}
            WEB_APP_URL={WEB_APP_URL}
          />
        )}
        {activeTab === "equipos" && (
          <SeccionEquipos
            inscripciones={data.inscripciones}
            actividades={data.actividades}
          />
        )}
        {activeTab === "rankings" && (
          <SeccionRankings
            resultados={data.resultados}
            actividades={data.actividades}
          />
        )}
        {activeTab === "participantes" && (
          <SeccionParticipantes inscripciones={data.inscripciones} />
        )}
        {activeTab === "reportes" && <SeccionReportes {...data} />}
        {activeTab === "nueva" && (
          <AdminPublicador
            siguienteID={siguienteID}
            onFinish={() => {
              loadAllData();
              setActiveTab("actividades");
            }}
            onCancel={() => setActiveTab("actividades")}
          />
        )}
      </main>

      {showEditModal && (
        <EditModal
          activity={editingActivity}
          onClose={() => setShowEditModal(false)}
          onSave={loadAllData}
          WEB_APP_URL={WEB_APP_URL}
        />
      )}
    </div>
  );
};

export default IntramurosPanel;
