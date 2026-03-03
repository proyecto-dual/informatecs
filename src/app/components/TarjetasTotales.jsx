"use client";
import "@/styles/admin/inscripciones.css";
import { useEffect, useState } from "react";
import {
  Users,
  ClipboardList,
  UserRound,
  Landmark,
  Palette,
  Trophy,
  MoreHorizontal,
  GraduationCap,
  HandHeart,
  Smile,
} from "lucide-react";

// ── Animated Counter ───────────────────────────────────────────────────────────
function Counter({ value = 0, duration = 900 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / (duration / 16)));
    const timer = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

// ── Prop Bar ───────────────────────────────────────────────────────────────────
function PropBar({ pct, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div
      style={{
        width: 44,
        height: 5,
        borderRadius: 3,
        background: "#e5e7eb",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 3,
          background: color,
          width: `${width}%`,
          transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const TarjetasTotales = ({ totales }) => {
  const {
    totalEstudiantes,
    totalActividades,
    porSexo,
    porTipoActividad,
    porProposito,
  } = totales;

  // 👇 Descomenta esta línea si quieres ver qué llega exactamente desde la API:
  // console.log("porTipoActividad:", porTipoActividad);

  const tipoConfig = [
    { key: "CIVICA", label: "Cívicas", Icon: Landmark, color: "#1b396a" },
    { key: "CULTURAL", label: "Culturales", Icon: Palette, color: "#1b396a" },
    { key: "DEPORTIVA", label: "Deportivas", Icon: Trophy, color: "#1b396a" },
    { key: "OTRA", label: "Otras", Icon: MoreHorizontal, color: "#1b396a" },
  ];

  const propositoConfig = [
    {
      key: "creditos",
      label: "Créditos",
      Icon: GraduationCap,
      color: "#507cdbff",
      bg: "#eff6ff",
    },
    {
      key: "servicio_social",
      label: "Servicio Social",
      Icon: HandHeart,
      color: "#507cdbff",
      bg: "#f0fdf4",
    },
    {
      key: "por_gusto",
      label: "Por Gusto",
      Icon: Smile,
      color: "#507cdbff",
      bg: "#fefce8",
    },
  ];

  const maxProp = Math.max(
    ...propositoConfig.map((p) => porProposito?.[p.key] ?? 0),
    1,
  );

  const heroCards = [
    {
      cls: "tt-hero-card--students",
      label: "Total Estudiantes",
      value: totalEstudiantes,
      sub: "inscritos activos",
      Icon: Users,
    },
    {
      cls: "tt-hero-card--activities",
      label: "Total Actividades",
      value: totalActividades,
      sub: "disponibles",
      Icon: ClipboardList,
    },
    {
      cls: "tt-hero-card--women",
      label: "Mujeres",
      value: porSexo?.F ?? 0,
      sub: "estudiantes",
      Icon: UserRound,
      iconStyle: { strokeWidth: 2 },
    },
    {
      cls: "tt-hero-card--men",
      label: "Hombres",
      value: porSexo?.M ?? 0,
      sub: "estudiantes",
      Icon: UserRound,
    },
  ];

  return (
    <>
      <div className="tt-root">
        {/* ── Hero cards ── */}
        <div className="tt-hero">
          {heroCards.map(({ cls, label, value, sub, Icon }) => (
            <div key={label} className={`tt-hero-card ${cls}`}>
              <div className="tt-bg-c tt-bg-c1" />
              <div className="tt-bg-c tt-bg-c2" />
              <div className="tt-hero-label">{label}</div>
              <div className="tt-hero-value">
                <Counter value={value} />
              </div>
              <div className="tt-hero-sub">{sub}</div>
              <div className="tt-hero-icon">
                <Icon size={44} color="#fff" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Sections ── */}
        <div className="tt-sections">
          {/* Por Tipo */}
          <div className="tt-section-card">
            <div className="tt-section-header">
              <div
                className="tt-section-dot"
                style={{ background: "#507cdbff " }}
              />
              <p className="tt-section-title">Personas inscritas por Tipo</p>
            </div>
            <div className="tt-tipo-grid">
              {tipoConfig.map(({ key, label, Icon, color }) => (
                <div className="tt-tipo-item" key={key}>
                  <div
                    className="tt-tipo-icon-wrap"
                    style={{ background: `${color}18` }}
                  >
                    <Icon size={17} color={color} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="tt-tipo-name">{label}</p>
                    <div className="tt-tipo-count" style={{ color }}>
                      <Counter value={porTipoActividad?.[key] ?? 0} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Por Propósito */}
          <div className="tt-section-card">
            <div className="tt-section-header">
              <div
                className="tt-section-dot"
                style={{ background: "#507cdbff" }}
              />
              <p className="tt-section-title">Inscripciones por Propósito</p>
            </div>
            <div className="tt-prop-list">
              {propositoConfig.map(({ key, label, Icon, color, bg }) => {
                const val = porProposito?.[key] ?? 0;
                const pct = (val / maxProp) * 100;
                return (
                  <div
                    key={key}
                    className="tt-prop-item"
                    style={{ background: bg, borderColor: `${color}22` }}
                  >
                    <Icon
                      size={17}
                      color={color}
                      strokeWidth={2.2}
                      style={{ flexShrink: 0 }}
                    />
                    <span className="tt-prop-label">{label}</span>
                    <PropBar pct={pct} color={color} />
                    <span className="tt-prop-count" style={{ color }}>
                      <Counter value={val} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TarjetasTotales;
