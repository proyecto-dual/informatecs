import "@/styles/admin/adminpanel.css";
import React from "react";
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  Users,
  Clock,
  User,
} from "lucide-react";

export const SeccionCatalogo = ({
  actividades,
  busqueda,
  setBusqueda,
  ofertadas,
  onAbrirConfig,
  onVerMaestro,
}) => (
  <div className="card catalogo">
    <h3>Catálogo ({actividades.length})</h3>
    <div className="busqueda">
      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <Search className="search-icon" size={18} />
    </div>
    <div className="lista-actividades">
      {actividades.map((act) => {
        const agregada = ofertadas.some((o) => o.id === act.id);
        return (
          <div key={act.id} className="actividad-item">
            <div className="actividad-info">
              <h4>{act.aconco || act.aticve}</h4>
              <div className="meta">
                {act.maestroId && (
                  <span
                    className="con-maestro clickeable"
                    onClick={() => onVerMaestro(act)}
                  >
                    ✓ Maestro
                  </span>
                )}
                {act.horario && <span className="con-horario">✓ Horario</span>}
              </div>
            </div>
            <button
              className={agregada ? "btn-agregado" : "btn-configurar"}
              onClick={() => !agregada && onAbrirConfig(act)}
              disabled={agregada}
            >
              {agregada ? "Agregada" : <Plus size={16} />}
            </button>
          </div>
        );
      })}
    </div>
  </div>
);

export const SeccionOferta = ({ ofertadas, onQuitar, onPublicar }) => (
  <div className="card oferta">
    <div className="flex-between">
      <h3>Oferta ({ofertadas.length})</h3>
      <button
        className="btn-publicar enabled"
        onClick={onPublicar}
        disabled={ofertadas.length === 0}
      >
        <Calendar size={20} /> Publicar
      </button>
    </div>
    {ofertadas.length === 0 ? (
      <div className="sin-actividades">
        <Users size={48} />
        <p>No hay seleccionadas</p>
      </div>
    ) : (
      ofertadas.map((act) => (
        <div key={act.id} className="actividad-oferta">
          <div>
            <h4>{act.aconco}</h4>
            {act.horario && (
              <p className="txt-mini">
                <Clock size={12} /> {act.horario.dias?.join(", ")}
              </p>
            )}
          </div>
          <button className="btn-eliminar" onClick={() => onQuitar(act.id)}>
            <Trash2 size={20} />
          </button>
        </div>
      ))
    )}
  </div>
);
