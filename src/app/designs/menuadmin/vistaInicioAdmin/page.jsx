"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Users,
  Calendar,
  Search,
  Sparkles,
  Clock,
  User,
  Plus,
  X,
  RefreshCw,
} from "lucide-react";
import "@/styles/admin/adminpanel.css";

const CARDS_ACTIVIDADES = [
  { label: "Futbol Soccer", cls: "lbl-1" },
  { label: "Basquetbol", cls: "lbl-2" },
  { label: "Danza folclórica", cls: "lbl-3" },
  { label: "Música", cls: "lbl-4" },
  { label: "Voleibol", cls: "lbl-5" },
  { label: "Ajedrez", cls: "lbl-6" },
  { label: "Escolta", cls: "lbl-7" },
  { label: "Teatro", cls: "lbl-8" },
  { label: "Tenis", cls: "lbl-9" },
  { label: "Softbol", cls: "lbl-10" },
  { label: "Tenis de mesa", cls: "lbl-11" },
  { label: "Club de lectura", cls: "lbl-12" },
  { label: "Catrines/Catrinas", cls: "lbl-13" },
];

const AdminPanel = () => {
  const [modalVerMaestro, setModalVerMaestro] = useState(null);
  const [todasActividades, setTodasActividades] = useState([]);
  const [actividadesOfertadas, setActividadesOfertadas] = useState([]);
  const [actividadesPublicadas, setActividadesPublicadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const toggleAlbatros = () => {
    document.body.classList.toggle("ocultar-albatros");
  };
  const [mostrarAlbatros, setMostrarAlbatros] = useState(true);

  const [modalAgregar, setModalAgregar] = useState(null);
  const [busquedaMaestro, setBusquedaMaestro] = useState("");
  const [maestrosEncontrados, setMaestrosEncontrados] = useState([]);
  const [buscandoMaestro, setBuscandoMaestro] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    dias: [],
    horaInicio: "",
    horaFin: "",
    salon: "",
    maestroId: null,
    maestroNombre: "",
  });

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  useEffect(() => {
    cargarActividades();
    cargarPublicadas();
  }, []);

  const cargarActividades = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/actividades");
      if (!response.ok) throw new Error("Error al cargar actividades");
      const actividades = await response.json();
      setTodasActividades(actividades);
    } catch (error) {
      console.error(error);
      alert("Error de conexión o al cargar actividades");
    } finally {
      setLoading(false);
    }
  };

  const cargarPublicadas = async () => {
    try {
      const response = await fetch("/api/ofertas-semestre/batch");
      if (!response.ok) throw new Error("Error al cargar publicadas");
      const data = await response.json();
      setActividadesPublicadas(data);
    } catch (error) {
      console.error("Error al cargar publicadas:", error);
    }
  };

  const abrirModalAgregar = (actividad) => {
    setModalAgregar(actividad);
    setFormulario({
      dias: actividad.horario?.dias || [],
      horaInicio: actividad.horario?.horaInicio || "",
      horaFin: actividad.horario?.horaFin || "",
      salon: actividad.horario?.salon || "",
      maestroId: actividad.maestroId || null,
      maestroNombre: actividad.maestro
        ? `${actividad.maestro.pernom} ${actividad.maestro.perapp} ${actividad.maestro.perapm}`.trim()
        : "",
    });
    setBusquedaMaestro("");
    setMaestrosEncontrados([]);
  };

  const toggleDia = (dia) => {
    setFormulario((prev) => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter((d) => d !== dia)
        : [...prev.dias, dia],
    }));
  };

  const buscarMaestros = async (query) => {
    if (query.length < 2) {
      setMaestrosEncontrados([]);
      return;
    }
    try {
      setBuscandoMaestro(true);
      const response = await fetch(
        `/api/maestros-buscar?q=${encodeURIComponent(query)}`
      );
      const maestros = await response.json();
      setMaestrosEncontrados(maestros);
    } catch (error) {
      console.error("Error al buscar maestros:", error);
    } finally {
      setBuscandoMaestro(false);
    }
  };

  const seleccionarMaestro = (maestro) => {
    setFormulario((prev) => ({
      ...prev,
      maestroId: maestro.id,
      maestroNombre: maestro.nombreCompleto,
    }));
    setBusquedaMaestro("");
    setMaestrosEncontrados([]);
  };

  const removerMaestro = () => {
    setFormulario((prev) => ({
      ...prev,
      maestroId: null,
      maestroNombre: "",
    }));
  };

  const guardarYAgregar = async () => {
    if (formulario.dias.length === 0) {
      alert("Selecciona al menos un día");
      return;
    }
    if (!formulario.horaInicio || !formulario.horaFin) {
      alert("Completa los horarios de inicio y fin");
      return;
    }
    if (!formulario.maestroId) {
      if (!confirm("No has asignado un maestro. ¿Deseas continuar?")) return;
    }

    try {
      setGuardando(true);
      const horarioResponse = await fetch(`/api/horario`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modalAgregar.id,
          horario: {
            dias: formulario.dias,
            horaInicio: formulario.horaInicio,
            horaFin: formulario.horaFin,
            salon: formulario.salon,
          },
        }),
      });
      if (!horarioResponse.ok) throw new Error("Error al guardar horario");

      if (formulario.maestroId) {
        const maestroResponse = await fetch("/api/asignar-maestros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actividadId: modalAgregar.id,
            maestroId: formulario.maestroId,
          }),
        });
        if (!maestroResponse.ok) throw new Error("Error al asignar maestro");
      }

      const actividadActualizada = {
        ...modalAgregar,
        horario: {
          dias: formulario.dias,
          horaInicio: formulario.horaInicio,
          horaFin: formulario.horaFin,
          salon: formulario.salon,
        },
        maestroId: formulario.maestroId,
        maestro: formulario.maestroId
          ? {
              percve: formulario.maestroId,
              pernom: formulario.maestroNombre.split(" ")[0] || "",
              perapp: formulario.maestroNombre.split(" ")[1] || "",
              perapm: formulario.maestroNombre.split(" ")[2] || "",
            }
          : null,
      };

      setTodasActividades((prev) =>
        prev.map((act) =>
          act.id === modalAgregar.id ? actividadActualizada : act
        )
      );

      if (!actividadesOfertadas.find((act) => act.id === modalAgregar.id)) {
        setActividadesOfertadas((prev) => [...prev, actividadActualizada]);
      }

      alert("Actividad configurada y agregada a la oferta");
      setModalAgregar(null);
      await cargarActividades();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const quitarDeOferta = (actividadId) => {
    setActividadesOfertadas(
      actividadesOfertadas.filter((act) => act.id !== actividadId)
    );
  };

  const publicarActividades = async () => {
    if (actividadesOfertadas.length === 0) {
      alert("Selecciona al menos una actividad para ofertar.");
      return;
    }
    if (!confirm(`¿Publicar ${actividadesOfertadas.length} actividades?`))
      return;

    try {
      setPublicando(true);
      const ofertas = actividadesOfertadas.map((actividad) => ({
        actividadId: actividad.id,
        semestre: "2024-2",
        activa: true,
      }));
      const response = await fetch("/api/ofertas-semestre/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ofertas }),
      });
      if (!response.ok) throw new Error("Error al publicar actividades");
      alert("¡Actividades publicadas!");
      setActividadesOfertadas([]);
      await cargarPublicadas();
    } catch (error) {
      console.error(error);
      alert("Error de conexión o al publicar actividades");
    } finally {
      setPublicando(false);
    }
  };

  //  eliminar una oferta publicada 
  const eliminarPublicada = async (oferta) => {
    const nombre =
      oferta.actividad?.aconco || oferta.actividad?.aticve || "esta actividad";
    if (!confirm(`¿Desea continuar?\n\nSe eliminará "${nombre}" de las actividades publicadas.`))
      return;

    try {
      setEliminando(true);
      const response = await fetch(
        `/api/ofertas-semestre/batch?id=${oferta.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Error al eliminar");
      await cargarPublicadas();
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setEliminando(false);
    }
  };

  // reiniciar: eliminar todas las publicadas
  const reiniciarPublicadas = async () => {
    if (actividadesPublicadas.length === 0) return;
    if (
      !confirm(
        `¿Desea continuar?\n\nSe eliminarán TODAS las actividades publicadas (${actividadesPublicadas.length}). Esta acción no se puede deshacer.`
      )
    )
      return;

    try {
      setEliminando(true);
      const response = await fetch("/api/ofertas-semestre/batch", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al reiniciar");
      setActividadesPublicadas([]);
      alert("Todas las actividades publicadas fueron eliminadas.");
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setEliminando(false);
    }
  };

  const actividadesFiltradas = todasActividades.filter((act) =>
    (act.aconco ?? act.aticve ?? "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="card loading-card">
          <h2>Cargando actividades...</h2>
          <p>Preparando el catálogo completo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* ───────── MODALES ───────── */}
      {modalAgregar && (
        <div className="modal-overlay">
          <div className="modal-content modal-agregar">
            <div className="modal-header">
              <div>
                <h3>Configurar y Agregar Actividad</h3>
                <p className="modal-subtitle">
                  {modalAgregar.aconco || modalAgregar.aticve} — Código:{" "}
                  {modalAgregar.aticve}
                </p>
              </div>
              <button
                className="btn-close"
                onClick={() => setModalAgregar(null)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="seccion-form">
                <h4>
                  <Clock size={20} /> Horario
                </h4>
                <label>Días de la semana:</label>
                <div className="dias-grid">
                  {diasSemana.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      className={
                        formulario.dias.includes(dia) ? "dia activo" : "dia"
                      }
                      onClick={() => toggleDia(dia)}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
                <div className="grid-2-campos">
                  <div>
                    <label>Hora inicio:</label>
                    <input
                      type="time"
                      value={formulario.horaInicio}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          horaInicio: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Hora fin:</label>
                    <input
                      type="time"
                      value={formulario.horaFin}
                      onChange={(e) =>
                        setFormulario({
                          ...formulario,
                          horaFin: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <label>Salón o ubicación:</label>
                <input
                  type="text"
                  value={formulario.salon}
                  onChange={(e) =>
                    setFormulario({ ...formulario, salon: e.target.value })
                  }
                  placeholder="Ej: Aula 301, Cancha 2"
                />
              </div>

              <div className="seccion-form">
                <h4>
                  <User size={20} /> Maestro
                </h4>
                {formulario.maestroId ? (
                  <div className="maestro-seleccionado">
                    <div className="maestro-info">
                      <User size={24} />
                      <div>
                        <strong>{formulario.maestroNombre}</strong>
                        <p>ID: {formulario.maestroId}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-remover-maestro"
                      onClick={removerMaestro}
                    >
                      <X size={16} /> Cambiar
                    </button>
                  </div>
                ) : (
                  <>
                    <label>Buscar por ID o Nombre:</label>
                    <input
                      type="text"
                      value={busquedaMaestro}
                      onChange={(e) => {
                        setBusquedaMaestro(e.target.value);
                        buscarMaestros(e.target.value);
                      }}
                      placeholder="Ej: 88 o César Noel"
                    />
                    {buscandoMaestro && (
                      <p className="texto-cargando">Buscando...</p>
                    )}
                    {maestrosEncontrados.length > 0 && (
                      <div className="lista-maestros">
                        {maestrosEncontrados.map((maestro) => (
                          <div key={maestro.id} className="maestro-item">
                            <div>
                              <strong>{maestro.nombreCompleto}</strong>
                              <p>ID: {maestro.id}</p>
                              <p className="texto-secundario">
                                {maestro.departamento || "Sin departamento"}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="btn-seleccionar"
                              onClick={() => seleccionarMaestro(maestro)}
                            >
                              Seleccionar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setModalAgregar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-guardar"
                onClick={guardarYAgregar}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar y Agregar a Oferta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalVerMaestro && (
        <div className="modal-overlay" onClick={() => setModalVerMaestro(null)}>
          <div
            className="modal-content modal-small"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Maestro Asignado</h3>
            <p className="materia-modal-title">
              {modalVerMaestro.aconco || modalVerMaestro.aticve}
            </p>
            <p className="codigo-modal">Código: {modalVerMaestro.aticve}</p>
            {modalVerMaestro.maestro ? (
              <div className="maestro-info-box">
                <div className="maestro-avatar">
                  <User size={48} />
                </div>
                <div className="maestro-detalles">
                  <h4>
                    {modalVerMaestro.maestro.pernom}{" "}
                    {modalVerMaestro.maestro.perapp}{" "}
                    {modalVerMaestro.maestro.perapm}
                  </h4>
                  <p>
                    <strong>ID:</strong> {modalVerMaestro.maestro.percve}
                  </p>
                  {modalVerMaestro.maestro.perdce && (
                    <p>
                      <strong>Email:</strong> {modalVerMaestro.maestro.perdce}
                    </p>
                  )}
                  {modalVerMaestro.maestro.perdep && (
                    <p>
                      <strong>Departamento:</strong>{" "}
                      {modalVerMaestro.maestro.perdep}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p>No hay maestro asignado</p>
            )}
            <div className="modal-buttons">
              <button
                className="btn-primary"
                onClick={() => setModalVerMaestro(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HEADER ══ */}
      <div className="card header-card">
        <div className="header-text titulo-wrap">
          <img
            src="/imagenes/basss.gif"
            alt=""
            className="alb alb-arriba"
            aria-hidden="true"
          />
          <img
            src="/imagenes/albatrobanda.gif"
            alt=""
            className="alb alb-abajo"
            aria-hidden="true"
          />
          <img
            src="/imagenes/logosin.gif"
            alt=""
            className="alb alb-tercero"
            aria-hidden="true"
          />
          <h2>Gestionar Actividades</h2>
          <p>
            Configura y selecciona las actividades que deseas ofertar este
            semestre
          </p>
        </div>

        <div className="act-collage" aria-hidden="true">
          <div className="act-col-small">
            <div className="act-sm sm-1"></div>
            <div className="act-sm sm-2"></div>
            <div className="act-sm sm-3"></div>
          </div>
          <div className="act-card-big">
            <div className="act-card-labels">
              {CARDS_ACTIVIDADES.map((card, i) => (
                <span key={i} className={`lbl ${card.cls}`}>
                  {card.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ CATÁLOGO + OFERTA ══ */}
      <div className="grid-2">
        {/* CATÁLOGO */}
        <div className="card catalogo">
          <h3>Catálogo ({todasActividades.length})</h3>
          <div className="busqueda">
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <Search className="search-icon" size={18} />
          </div>

          <div className="lista-actividades">
            {actividadesFiltradas.length === 0 ? (
              <p>No se encontraron actividades</p>
            ) : (
              actividadesFiltradas.map((actividad) => {
                const agregada = actividadesOfertadas.find(
                  (act) => act.id === actividad.id
                );
                return (
                  <div key={actividad.id} className="actividad-item">
                    <div className="actividad-info">
                      <h4>{actividad.aconco || actividad.aticve}</h4>
                      <p>Código: {actividad.aticve}</p>
                      <div className="meta">
                        <span>{actividad.acocre} créditos</span>
                        <span>{actividad.acohrs} hrs</span>
                        {actividad.horario && (
                          <span className="con-horario">✓ Horario</span>
                        )}
                        {actividad.maestroId && (
                          <span
                            className="con-maestro clickeable"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalVerMaestro(actividad);
                            }}
                            title="Click para ver maestro"
                          >
                            ✓ Maestro
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className={agregada ? "btn-agregado" : "btn-configurar"}
                      onClick={() => {
                        if (!agregada) abrirModalAgregar(actividad);
                      }}
                      disabled={!!agregada}
                    >
                      {agregada ? (
                        <>✓ Agregada</>
                      ) : (
                        <>
                          <Plus size={16} /> Configurar y Agregar
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* OFERTA PENDIENTE */}
        <div className="card oferta">
          <div className="flex-between">
            <h3>Oferta ({actividadesOfertadas.length})</h3>
            <button
              className={
                actividadesOfertadas.length > 0 && !publicando
                  ? "btn-publicar enabled"
                  : "btn-publicar disabled"
              }
              onClick={publicarActividades}
              disabled={actividadesOfertadas.length === 0 || publicando}
            >
              <Calendar size={20} />
              {publicando ? "Publicando..." : "Publicar"}
            </button>
          </div>

          {actividadesOfertadas.length === 0 ? (
            <div className="sin-actividades">
              <Users size={48} />
              <p>No hay actividades seleccionadas</p>
            </div>
          ) : (
            actividadesOfertadas.map((actividad) => (
              <div key={actividad.id} className="actividad-oferta">
                <div>
                  <h4>{actividad.aconco || actividad.aticve}</h4>
                  {actividad.horario && (
                    <p className="detalle-horario">
                      <Clock size={14} /> {actividad.horario.dias.join(", ")} •{" "}
                      {actividad.horario.horaInicio} -{" "}
                      {actividad.horario.horaFin}
                      {actividad.horario.salon &&
                        ` • ${actividad.horario.salon}`}
                    </p>
                  )}
                  {actividad.maestro && (
                    <p className="detalle-maestro">
                      <User size={14} /> {actividad.maestro.pernom}{" "}
                      {actividad.maestro.perapp}
                    </p>
                  )}
                </div>
                <button
                  className="btn-eliminar"
                  onClick={() => quitarDeOferta(actividad.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/*ACTIVIDADES PUBLICADAS (CRUD)*/}
      <div className="card publicadas">
        <div className="flex-between">
          <h3>
            <Sparkles size={20} /> Actividades Publicadas ({actividadesPublicadas.length})
          </h3>
          <button
            className={
              actividadesPublicadas.length > 0 && !eliminando
                ? "btn-reiniciar enabled"
                : "btn-reiniciar disabled"
            }
            onClick={reiniciarPublicadas}
            disabled={actividadesPublicadas.length === 0 || eliminando}
            title="Eliminar todas las actividades publicadas"
          >
            <RefreshCw size={18} />
            {eliminando ? "Eliminando..." : "Reiniciar todo"}
          </button>
        </div>

        {actividadesPublicadas.length === 0 ? (
          <div className="sin-actividades">
            <Calendar size={48} />
            <p>No hay actividades publicadas aún</p>
          </div>
        ) : (
          <div className="lista-publicadas">
            {actividadesPublicadas.map((oferta) => (
              <div key={oferta.id} className="actividad-publicada">
                <div className="publicada-info">
                  <h4>{oferta.actividad?.aconco || oferta.actividad?.aticve}</h4>
                  <div className="meta">
                    <span>Semestre: {oferta.semestre}</span>
                    <span className={oferta.activa ? "badge-activa" : "badge-inactiva"}>
                      {oferta.activa ? "Activa" : "Inactiva"}
                    </span>
                    {oferta.fechaPublicacion && (
                      <span>
                        {new Date(oferta.fechaPublicacion).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {oferta.maestro && (
                      <span>
                        <User size={13} /> {oferta.maestro.pernom} {oferta.maestro.perapp}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarPublicada(oferta)}
                  disabled={eliminando}
                  title="Eliminar esta actividad publicada"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;