import { Users, ChevronDown, ChevronUp } from "lucide-react";
import "@/styles/admin/InscripcionesPanel.css";

const TIPO_CLASS = {
  CIVICA: "ip-type-badge--civica",
  CULTURAL: "ip-type-badge--cultural",
  DEPORTIVA: "ip-type-badge--deportiva",
  OTRA: "ip-type-badge--otra",
};

const PROPOSITO_CLASS = {
  creditos: "ip-prop-badge--creditos",
  servicio_social: "ip-prop-badge--servicio",
  por_gusto: "ip-prop-badge--gusto",
};

const PROPOSITO_LABEL = {
  creditos: "Créditos",
  servicio_social: "Servicio Social",
  por_gusto: "Por Gusto",
};

const ActividadCard = ({
  oferta,
  tipoActividad,
  inscritosFiltrados,
  isExpanded,
  onToggle,
  onVerEstudiante,
  onValidarSangre,
}) => (
  <div className="ip-activity">
    {/* Cabecera colapsable */}
    <button className="ip-activity-toggle" onClick={onToggle}>
      <div className="ip-activity-info">
        <div className="ip-activity-name-row">
          <h3 className="ip-activity-name">
            {oferta.actividad?.aconco || oferta.actividad?.aticve || ""}
          </h3>
          <span
            className={`ip-type-badge ${TIPO_CLASS[tipoActividad] || "ip-type-badge--otra"}`}
          >
            {tipoActividad}
          </span>
        </div>
        <div className="ip-activity-meta">
          <span>Código: {oferta.actividad.aticve}</span>
          <span>Créditos: {oferta.actividad.acocre}</span>
          <span>Horas: {oferta.actividad.acohrs}</span>
        </div>
      </div>

      <div className="ip-activity-right">
        <span
          className={`ip-inscribed-count ${inscritosFiltrados.length > 0 ? "ip-inscribed-count--active" : "ip-inscribed-count--empty"}`}
        >
          <Users size={14} />
          {inscritosFiltrados.length} inscritos
        </span>
        <span className="ip-chevron">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>
    </button>

    {/* Tabla expandida */}
    {isExpanded && (
      <div className="ip-table-section">
        {inscritosFiltrados.length === 0 ? (
          <p className="ip-table-empty">
            No hay estudiantes inscritos con los filtros seleccionados
          </p>
        ) : (
          <div className="ip-table-scroll">
            <p className="ip-table-hint">
              👆 Haz clic en cualquier fila para ver el expediente completo del
              estudiante
            </p>
            <table className="ip-table">
              <thead>
                <tr>
                  <th>No. Control</th>
                  <th>Nombre</th>
                  <th>Semestre</th>
                  <th>Sexo</th>
                  <th>Propósito</th>
                  <th>Tipo de Sangre</th>
                  <th>Fecha Inscripción</th>
                </tr>
              </thead>
              <tbody>
                {inscritosFiltrados.map((inscripcion, idx) => {
                  const { estudiante, formularioData, fechaInscripcion } =
                    inscripcion;
                  const nombre =
                    `${estudiante.alunom || ""} ${estudiante.aluapp || ""} ${estudiante.aluapm || ""}`.trim();
                  const propPurpose = formularioData?.purpose;
                  const propClass =
                    PROPOSITO_CLASS[propPurpose] || "ip-prop-badge--na";
                  const propLabel =
                    PROPOSITO_LABEL[propPurpose] || propPurpose || "N/A";
                  const sangActual = estudiante?.alutsa;
                  const sangSolic = inscripcion.tipoSangreSolicitado;
                  const validada = inscripcion.sangreValidada;

                  return (
                    <tr
                      key={idx}
                      className="ip-table-row"
                      onClick={() => onVerEstudiante(inscripcion)}
                      title="Ver expediente completo"
                    >
                      <td className="ip-td-control">{estudiante.aluctr}</td>
                      <td>{nombre || "Sin nombre"}</td>
                      <td className="ip-td-muted">
                        {estudiante?.calnpe || "N/A"}
                      </td>
                      <td className="ip-td-muted">
                        {estudiante?.alusex === 1
                          ? "Masculino"
                          : estudiante?.alusex === 2
                            ? "Femenino"
                            : "N/A"}
                      </td>
                      <td>
                        <span className={`ip-prop-badge ${propClass}`}>
                          {propLabel}
                        </span>
                      </td>
                      <td>
                        {sangSolic && !validada ? (
                          <div className="ip-blood-cell">
                            {sangActual && (
                              <span className="ip-blood-actual">
                                Actual: {sangActual}
                              </span>
                            )}
                            <button
                              className="ip-blood-validate-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                onValidarSangre(inscripcion);
                              }}
                            >
                              ⚠️ VALIDAR {sangSolic}
                            </button>
                          </div>
                        ) : sangActual ? (
                          <span className="ip-blood-registered">
                            🩸 {sangActual}
                          </span>
                        ) : (
                          <span className="ip-blood-none">Sin registro</span>
                        )}
                      </td>
                      <td className="ip-td-muted">
                        {new Date(fechaInscripcion).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
  </div>
);

export default ActividadCard;
