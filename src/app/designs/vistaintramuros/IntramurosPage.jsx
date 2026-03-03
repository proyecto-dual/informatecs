import React from "react";
import IntramurosList from "./IntramurosList";
import IntramurosCalendar from "./componentes/IntramurosCalendar";

const IntramurosPage = () => {
  return (
    <div className="intramuros-main-page">
      <h1> Actividades Extracurriculares Intramuros ITE</h1>
      <p>
        Información centralizada sobre torneos, ligas y eventos deportivos
        internos. La información es actualizada en tiempo real desde el Registro
        Único del ITE.
      </p>

      {/* El Calendario (Alta Visibilidad) */}
      <section>
        <IntramurosCalendar />
      </section>

      {/* La Lista (Detalles y Contacto) */}
      <section>
        <IntramurosList />
      </section>

      <div className="footer-note">
        <p>
          Para inscribirte, consulta los detalles de la actividad y usa la
          información de contacto del Coordinador. Las inscripciones se
          gestionan a través de Google Forms o el departamento correspondiente.
        </p>
      </div>
    </div>
  );
};

export default IntramurosPage;
