"use client";
import React, { useState, useEffect, useMemo } from "react";
import "../estilos/intramurocalendario.css"; // Asegúrate de tener tu CSS vinculado
import {
  Calendar,
  Clock3,
  MapPin,
  Info,
  List,
  CalendarDays,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

const IntramurosCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ====================================================================
  // === FORMATEO DE HORA Y FECHA (AMERICA/TIJUANA) ===
  // ====================================================================

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    if (
      typeof timeString === "string" &&
      timeString.length === 5 &&
      timeString.includes(":")
    ) {
      return timeString;
    }
    const date = new Date(timeString);
    if (isNaN(date)) return "N/A";

    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Tijuana",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDateShort = (date) => {
    if (!date) return "N/A";
    return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${date.getUTCFullYear()}`;
  };

  const formatDateLong = (date) => {
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  };

  const parseDateSafe = (dateVal) => {
    if (!dateVal) return null;
    try {
      let dateStr = dateVal.toString().split("T")[0];
      let parts = dateStr.includes("-")
        ? dateStr.split("-")
        : dateStr.split("/");
      if (parts.length === 3) {
        const y =
          parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
        const m =
          parts[0].length === 4
            ? parseInt(parts[1]) - 1
            : parseInt(parts[1]) - 1;
        const d =
          parts[0].length === 4 ? parseInt(parts[2]) : parseInt(parts[0]);
        return new Date(Date.UTC(y, m, d));
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const getStatusConfig = (status) => {
    const s = status?.toLowerCase().trim();
    if (s === "abierto")
      return { class: "st-open", label: "Inscripciones Abiertas" };
    if (s === "en curso") return { class: "st-progress", label: "En Curso" };
    return { class: "st-closed", label: "Cerrada" };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/intramuros");
        const result = await response.json();

        const formatted = (result.data || [])
          .map((ev) => ({
            id: ev.ID_Actividad,
            title: ev.Actividad || ev.Nombre_Actividad,
            start: parseDateSafe(ev.Fecha_Inicio || ev.Fecha),
            end: parseDateSafe(ev.Fecha_Fin), // AGREGAMOS FECHA FIN
            time: formatTime(ev.Hora_Inicio),
            lugar: ev.Lugar_Sede,
            area: ev.Deporte_o_Area || ev.Deporte_o_Área,
            status: ev.Estado,
            coord: ev.Coordinador,
          }))
          .filter((ev) => ev.start !== null);

        setEvents(formatted);
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const selectedDayEvents = useMemo(() => {
    return events.filter(
      (event) => event.start.getTime() === selectedDate.getTime(),
    );
  }, [events, selectedDate]);

  // ====================================================================
  // === COMPONENTE CALENDARIO ===
  // ====================================================================
  const CustomCalendar = () => {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(Date.UTC(year, month, i)));
    }

    return (
      <div className="custom-calendar">
        <div className="calendar-header">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1))}
            className="nav-btn"
          >
            ‹
          </button>
          <h3>
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1))}
            className="nav-btn"
          >
            ›
          </button>
        </div>
        <div className="calendar-grid">
          {["D", "L", "M", "M", "J", "V", "S"].map((d, idx) => (
            <div key={`h-${idx}`} className="day-name">
              {d}
            </div>
          ))}
          {days.map((day, i) => (
            <button
              key={`d-${i}`}
              className={`calendar-day ${!day ? "empty" : ""} 
                ${day && day.getTime() === selectedDate.getTime() ? "selected" : ""} 
                ${day && events.some((e) => e.start.getTime() === day.getTime()) ? "has-event" : ""}`}
              onClick={() => day && setSelectedDate(day)}
              disabled={!day}
            >
              {day ? day.getUTCDate() : ""}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="intra-wrapper">
      <header className="intra-header">
        <div className="header-inner">
          <div className="title-group">
            <div className="icon-circle">
              <Calendar size={28} />
            </div>
            <div>
              <h1>Calendario Intramuros</h1>
              <p>Instituto Tecnológico de Ensenada</p>
            </div>
          </div>
          <div className="sync-status">
            <div className={`dot ${loading ? "pulse" : "active"}`}></div>
            <span>
              {loading ? "Sincronizando..." : "Zona Horaria: Pacífico"}
            </span>
          </div>
        </div>
      </header>

      <main className="intra-content">
        <div className="grid-layout">
          <section className="cal-section">
            <div className="card">
              {loading ? (
                <div className="loading-state">
                  <Loader2 className="spinner" />
                </div>
              ) : (
                <CustomCalendar />
              )}
            </div>
          </section>

          <section className="events-section">
            <h2 className="section-subtitle">
              <List size={20} /> Eventos del {formatDateLong(selectedDate)}
            </h2>

            {selectedDayEvents.length > 0 ? (
              <div className="event-stack">
                {selectedDayEvents.map((ev, i) => {
                  const conf = getStatusConfig(ev.status);
                  return (
                    <div key={i} className="ev-card">
                      <div className="ev-header">
                        <span className="ev-tag">{ev.area}</span>
                        <span className={`ev-status ${conf.class}`}>
                          {conf.label}
                        </span>
                      </div>
                      <h3 className="ev-title">{ev.title}</h3>
                      <div className="ev-grid-details">
                        {/* RANGO DE FECHAS AGREGADO AQUÍ */}
                        <div className="detail">
                          <CalendarDays size={14} />
                          <span>
                            Del {formatDateShort(ev.start)} al{" "}
                            {formatDateShort(ev.end)}
                          </span>
                        </div>
                        <div className="detail">
                          <Clock3 size={14} /> <span>{ev.time}</span>
                        </div>
                        <div className="detail">
                          <MapPin size={14} /> <span>{ev.lugar}</span>
                        </div>
                        <div className="detail">
                          <User size={14} /> <span>{ev.coord}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>No hay actividades para esta fecha.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default IntramurosCalendar;
