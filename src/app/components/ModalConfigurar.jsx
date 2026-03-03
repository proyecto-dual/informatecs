import React, { useState } from "react";
import { Clock, User, X } from "lucide-react";
import "@/styles/admin/adminpanel.css";

const ModalConfigurar = ({ actividad, onClose, onSuccess }) => {
  const [buscandoMaestro, setBuscandoMaestro] = useState(false);
  const [maestrosEncontrados, setMaestrosEncontrados] = useState([]);
  const [busquedaMaestro, setBusquedaMaestro] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    dias: actividad.horario?.dias || [],
    horaInicio: actividad.horario?.horaInicio || "",
    horaFin: actividad.horario?.horaFin || "",
    salon: actividad.horario?.salon || "",
    maestroId: actividad.maestroId || null,
    maestroNombre: actividad.maestro
      ? `${actividad.maestro.pernom} ${actividad.maestro.perapp}`
      : "",
  });

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const buscarMaestros = async (query) => {
    if (query.length < 2) return setMaestrosEncontrados([]);
    setBuscandoMaestro(true);
    try {
      const res = await fetch(
        `/api/maestros-buscar?q=${encodeURIComponent(query)}`,
      );
      setMaestrosEncontrados(await res.json());
    } finally {
      setBuscandoMaestro(false);
    }
  };

  const manejarGuardar = async () => {
    setGuardando(true);
    // ... aquí va tu lógica de fetch PUT de horario y POST de maestro ...
    // Al final llamas a:
    onSuccess({
      ...actividad,
      horario: formulario,
      maestroNombre: formulario.maestroNombre,
    });
    setGuardando(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-agregar">
        <div className="modal-header">
          <h3>Configurar {actividad.aconco}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-body">
          {/* Sección Horarios */}
          <div className="seccion-form">
            <label>Días:</label>
            <div className="dias-grid">
              {diasSemana.map((d) => (
                <button
                  key={d}
                  className={formulario.dias.includes(d) ? "dia activo" : "dia"}
                  onClick={() =>
                    setFormulario({
                      ...formulario,
                      dias: formulario.dias.includes(d)
                        ? formulario.dias.filter((x) => x !== d)
                        : [...formulario.dias, d],
                    })
                  }
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="grid-2-campos">
              <input
                type="time"
                value={formulario.horaInicio}
                onChange={(e) =>
                  setFormulario({ ...formulario, horaInicio: e.target.value })
                }
              />
              <input
                type="time"
                value={formulario.horaFin}
                onChange={(e) =>
                  setFormulario({ ...formulario, horaFin: e.target.value })
                }
              />
            </div>
          </div>
          {/* Sección Maestro */}
          <div className="seccion-form">
            <label>Maestro:</label>
            <input
              placeholder="Buscar maestro..."
              value={busquedaMaestro}
              onChange={(e) => {
                setBusquedaMaestro(e.target.value);
                buscarMaestros(e.target.value);
              }}
            />
            {maestrosEncontrados.map((m) => (
              <div
                key={m.id}
                onClick={() =>
                  setFormulario({
                    ...formulario,
                    maestroId: m.id,
                    maestroNombre: m.nombreCompleto,
                  })
                }
              >
                {m.nombreCompleto}
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn-guardar"
            onClick={manejarGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfigurar;
