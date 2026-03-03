"use client";
import "@/styles/alumno/inicio.css";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  const [activeAlbatros, setActiveAlbatros] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const albatrosData = [
    {
      id: 1,
      name: "Albatro Ajedrez",
      image: "/imagenes/albatroajedrez.png",
      

    },
    {
      id: 2,
      name: "Albatro Catrín",
      image: "/imagenes/albatrocatrin.png",
      
     
    },
    {
      id: 3,
      name: "Albatro Aventurero",
      image: "/imagenes/albatroreally.png",
      
    },
    {
      id: 4,
      name: "Albatro Basquet",
      image: "/imagenes/basquet.png",
     

    },
    {
      id: 5,
      name: "Albatro Banda",
      image: "/imagenes/albatrobanda.png",
     
    },
    {
      id: 6,
      name: "Albatro Aventurero",
      image: "/imagenes/logoevento.png",

     
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveAlbatros((prev) => (prev + 1) % albatrosData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main welcome-main-enhanced">
       
        <div className={`welcome-hero ${isVisible ? 'visible' : ''}`}>
          <div className="albatros-showcase">
          
            <div className="main-albatros-container">
              {albatrosData.map((albatros, index) => (
                <div
                  key={albatros.id}
                  className={`albatros-slide ${
                    index === activeAlbatros ? "active" : ""
                  }`}
                >
                  <img
                    src={albatros.image}
                   
                    className="albatros-main-image"
                  />
                 
                </div>
              ))}
            </div>

           
            <div className="albatros-indicators">
              {albatrosData.map((albatros, index) => (
                <button
                  key={albatros.id}
                  onClick={() => setActiveAlbatros(index)}
                  className={`indicator-btn ${
                    index === activeAlbatros ? "active" : ""
                  }`}
                  aria-label={`Ver ${albatros.name}`}
                >
                  <img
                    src={albatros.image}
                    alt={albatros.name}
                    className="indicator-image"
                  />
                  <span className="indicator-label">{albatros.description}</span>
                </button>
              ))}
            </div>
          </div>

    
          <div className="welcome-content-enhanced">
            <div className="welcome-badge">
              <svg className="icon-trophy" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Portal de Eventos ITE</span>
            </div>
            <h1 className="welcome-title-enhanced">
              ¡Bienvenido a tu panel de eventos!
            </h1>

            <p className="welcome-description">

Antes de lanzarte a las actividades, dale un vistazo rápido a tu perfil para confirmar que tus datos estén al día. Una vez listo, podrás explorar la oferta disponible e inscribirte en lo que más te guste.

Desde aquí podrás seguir tus registros y, al terminar, descargar tu constancia de liberación fácilmente. ¡Esperamos que disfrutes la experiencia!
    </p>

          
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3>Perfil</h3>
                <p>Consulta y actualiza tu información personal y académica</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3>Actividades Ofertadas</h3>
                <p>Descubre e inscríbete en eventos adaptados a tus intereses </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3>Mis Actividades</h3>
                <p>Consulta las actividades en las que te has inscrito</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3>Constancias</h3>
                <p>Descarga y guarda tus constancias de participación</p>
              </div>
            </div>

          
          </div>
        </div>

      
      </main>
    </div>
  );
}