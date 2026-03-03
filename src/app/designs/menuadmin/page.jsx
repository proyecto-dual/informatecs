"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Users, GraduationCap } from "lucide-react";
import "@/styles/admin/panelinicio.css";
import GraficasAdminInicio from "@/app/components/GraficasAdminInicio";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({
    totalActividades: 0,
    totalEstudiantes: 0,
    totalHombres: 0,
    totalMujeres: 0,
    primerSemestre: 0,
    segundoSemestreEnAdelante: 0,
  });
  const [charts, setCharts] = useState({
    tipo: [],
    sexo: [],
    sem: [],
    group: [],
  });

  useEffect(() => {
    const nombreGuardado = localStorage.getItem("adminName");
    setAdminName(nombreGuardado || "Juan Carlos Leal Nodal!");
    cargarDatos();
  }, []);

  const clasificarTipo = (cod, nom, des) => {
    const text = `${nom || ""} ${des || ""}`.toUpperCase();
    if (
      cod?.toUpperCase() === "D" ||
      /FUTBOL|SOCCER|VOLEIBOL|BASQUET|ATLETISMO/i.test(text)
    )
      return "DEPORTIVA";
    if (/TUTORIA|TICS|CONGRESO|INVESTIGACION/i.test(text)) return "OTRA";
    if (/CIVICA|ESCOLTA|ACOPIO|CARRERA/i.test(text)) return "CIVICA";
    if (cod?.toUpperCase() === "C" || /CULTURAL|MUSICA|DANZA|ARTE/i.test(text))
      return "CULTURAL";
    return "OTRA";
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resAct, resIns] = await Promise.all([
        fetch("/api/act-disponibles").then((r) => r.json()),
        fetch("/api/inscripciones").then((r) => r.json()),
      ]);

      const counts = { CIVICA: 0, CULTURAL: 0, DEPORTIVA: 0, OTRA: 0 };
      const estudiantes = new Map(); // <--- Se define como 'estudiantes'

      resIns.forEach((i) => {
        const alu = i.estudiante;
        if (alu?.aluctr && !estudiantes.has(alu.aluctr)) {
          // CORRECCIÓN AQUÍ: Usar 'estudiantes' en lugar de 'estus'
          estudiantes.set(alu.aluctr, {
            sexo: alu.alusex,
            sem: parseInt(alu.calnpe || alu.alusme) || 0,
          });
        }
      });

      resAct.forEach((o) => {
        const tipo = clasificarTipo(
          o.actividad?.aticve,
          o.actividad?.aconco,
          o.actividad?.acodes,
        );
        counts[tipo]++;
      });

      const list = Array.from(estudiantes.values());
      const hombres = list.filter((e) => e.sexo === 1).length;
      const prim = list.filter((e) => e.sem === 1).length;

      setStats({
        totalActividades: resAct.length,
        totalEstudiantes: estudiantes.size,
        totalHombres: hombres,
        totalMujeres: estudiantes.size - hombres,
        primerSemestre: prim,
        segundoSemestreEnAdelante: estudiantes.size - prim,
      });

      setCharts({
        tipo: Object.entries(counts).map(([nombre, cantidad]) => ({
          nombre,
          cantidad,
        })),
        sexo: [
          { nombre: "Hombres", cantidad: hombres },
          { nombre: "Mujeres", cantidad: estudiantes.size - hombres },
        ],
        group: [
          { nombre: "1er Semestre", cantidad: prim },
          { nombre: "2do Semestre+", cantidad: estudiantes.size - prim },
        ],
        sem: Array.from({ length: 9 }, (_, i) => ({
          semestre: `${i + 1}°`,
          cantidad: list.filter((e) => e.sem === i + 1).length,
        })),
      });
    } catch (e) {
      console.error("Error en Dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="paneladmin__loading">
        <div className="paneladmin__spinner" />
      </div>
    );

  return (
    <div className="paneladmin">
      <main className="paneladmin__main">
        <div className="paneladmin__header">
          <div>
            <span className="paneladmin__fecha">
              {new Date().toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <h2 className="paneladmin__titulo">
              Estadísticas de Inscripciones
            </h2>
            <h1 className="paneladmin__subtitulo">
              ¡Bienvenido administrador,{" "}
              <span className="paneladmin__user-name">{adminName}</span>
            </h1>
          </div>
          <img
            src="/imagenes/logosin.gif"
            alt="Logo"
            className="paneladmin__logo"
          />
        </div>

        <div className="paneladmin__grid-4">
          {[
            {
              label: "Actividades Ofertadas",
              val: stats.totalActividades,
              icon: Calendar,
              color: "primary",
            },
            {
              label: "Total Inscritos",
              val: stats.totalEstudiantes,
              icon: Users,
              color: "yellow",
            },
            {
              label: "Hombres",
              val: stats.totalHombres,
              icon: Users,
              color: "hover",
            },
            {
              label: "Mujeres",
              val: stats.totalMujeres,
              icon: Users,
              color: "dark",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`paneladmin__stat paneladmin__stat--${s.color}`}
            >
              <div
                className={`paneladmin__stat-icon paneladmin__stat-icon--${s.color}`}
              >
                <s.icon size={20} />
              </div>
              <div className="paneladmin__stat-val">{s.val}</div>
              <div className="paneladmin__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="paneladmin__grid-2">
          <div className="paneladmin__stat paneladmin__stat--primary">
            <div className="paneladmin__stat-icon paneladmin__stat-icon--primary">
              <GraduationCap size={20} />
            </div>
            <div className="paneladmin__stat-val">{stats.primerSemestre}</div>
            <div className="paneladmin__stat-label">
              Estudiantes 1er Semestre
            </div>
            <div className="paneladmin__stat-sub">Alumnos de nuevo ingreso</div>
          </div>
          <div className="paneladmin__stat paneladmin__stat--yellow">
            <div className="paneladmin__stat-icon paneladmin__stat-icon--yellow">
              <GraduationCap size={20} />
            </div>
            <div className="paneladmin__stat-val">
              {stats.segundoSemestreEnAdelante}
            </div>
            <div className="paneladmin__stat-label">
              Estudiantes 2do Semestre+
            </div>
            <div className="paneladmin__stat-sub">Del 2° al 12° semestre</div>
          </div>
        </div>

        <GraficasAdminInicio charts={charts} />
      </main>
    </div>
  );
};

export default AdminDashboard;
