"use client";
import React from "react";
import { Award, Users, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  tipo: ["#1b396a", "#8eafef", "#fe9e10", "#c8d8f0"],
  sexo: ["#1b396a", "#fe9e10"],
  group: ["#1b396a", "#8eafef"],
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="paneladmin__tooltip">
      <p className="paneladmin__tooltip-label">{label ?? payload[0]?.name}</p>
      <p className="paneladmin__tooltip-val">{payload[0]?.value} estudiantes</p>
    </div>
  );
};

const DonutCard = ({
  title,
  icon: Icon,
  data,
  colors,
  iconClass,
  showTotal,
}) => (
  <div className="paneladmin__chart-card">
    <div className="paneladmin__chart-header">
      <div className={`paneladmin__chart-icon ${iconClass}`}>
        <Icon size={16} />
      </div>
      <h3>{title}</h3>
    </div>
    <div className="paneladmin__donut-wrap">
      <ResponsiveContainer width={190} height={190}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="cantidad"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="paneladmin__legend">
        {data.map((d, i) => (
          <div key={i} className="paneladmin__legend-item">
            <div
              className="paneladmin__legend-dot"
              style={{ background: colors[i] }}
            />
            <span className="paneladmin__legend-label">
              {d.nombre || d.name}
            </span>
            <span className="paneladmin__legend-val">{d.cantidad}</span>
          </div>
        ))}
        {showTotal && (
          <div className="paneladmin__total-box">
            <p className="tbl">Total</p>
            <p className="tbv">{data.reduce((s, d) => s + d.cantidad, 0)}</p>
            <p className="tbs">estudiantes registrados</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const GraficasAdminInicio = ({ charts }) => {
  if (!charts) return null;
  return (
    <>
      <div className="paneladmin__grid-charts">
        <DonutCard
          title="Actividades por Tipo"
          icon={Award}
          data={charts.tipo}
          colors={COLORS.tipo}
          iconClass="paneladmin__stat-icon--primary"
        />
        <DonutCard
          title="Estudiantes por Género"
          icon={Users}
          data={charts.sexo}
          colors={COLORS.sexo}
          iconClass="paneladmin__stat-icon--yellow"
        />
      </div>

      <div className="paneladmin__grid-charts">
        <div className="paneladmin__chart-card">
          <div className="paneladmin__chart-header">
            <h3>Estudiantes por Semestre</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts.sem} margin={{ left: -15 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(27,57,106,.07)"
              />
              <XAxis
                dataKey="semestre"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cantidad" fill="#8eafef" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <DonutCard
          title="1er Semestre vs 2do+"
          icon={TrendingUp}
          data={charts.group}
          colors={COLORS.group}
          iconClass="paneladmin__stat-icon--primary"
          showTotal
        />
      </div>
    </>
  );
};

export default GraficasAdminInicio;
