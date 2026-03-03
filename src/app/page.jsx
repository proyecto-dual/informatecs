"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/layout/navbar";
import Aos from "aos";
import "aos/dist/aos.css";

import Footer from "./components/layout/footer";

// Icons
import {
  FaCalendarCheck,
  FaChalkboardUser,
  FaFootball,
  FaHandHoldingHeart,
  FaUsers,
  FaMasksTheater,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa6";
import SplitText from "./components/animation/SplitText";

const HomePage = () => {
  const router = useRouter();

  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSeFavOw7p2RTtuzVdN9mQ2WH7Imy1B7uQ45s4HhsEOTSyJRrw/viewform";

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const [items, setItems] = useState([
    {
      id: 1,
      categoria: "Cultura",
      titulo: "Música y Arte",
      descripcion: "Expresa tu creatividad en nuestros grupos musicales",
      imagen: "/imagenes/musicaa.jpg",
    },
    {
      id: 2,
      categoria: "Deportes",
      titulo: "Voleibol",
      descripcion: "Forma parte del equipo representativo de voleibol",
      imagen: "/imagenes/volei.jpg",
    },
    {
      id: 3,
      categoria: "Deportes",
      titulo: "Futbol",
      descripcion: "Forma parte del equipo representativo de futbol",
      imagen: "/imagenes/fut.jpg",
    },
    {
      id: 4,
      categoria: "Deportes",
      titulo: "Softball",
      descripcion: "Desarrolla tus habilidades en la cancha",
      imagen: "/imagenes/softball.jpeg",
    },
    {
      id: 5,
      categoria: "Deportes",
      titulo: "Atletismo",
      descripcion: "Participa en competencias y supera tus límites",
      imagen: "/imagenes/corre.jpg",
    },
    {
      id: 6,
      categoria: "Deportes",
      titulo: "Voleibol Rep.",
      descripcion: "Participa en competencias y supera tus límites",
      imagen: "/imagenes/volei.jpg",
    },
  ]);

  const handleNext = useCallback(() => {
    setItems((prev) => {
      const arr = [...prev];
      const first = arr.shift();
      if (first) arr.push(first);
      return arr;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setItems((prev) => {
      const arr = [...prev];
      const last = arr.pop();
      if (last) arr.unshift(last);
      return arr;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <>
      <div className="homepage-wrapper">
        <div className="hero-container" data-aos="fade-in">
          <div className="hero-slide">
            {items.map((item) => (
              <div
                key={item.id}
                className="item"
                style={{ backgroundImage: `url(${item.imagen})` }}
              >
                <div className="content">
                  <div className="instituto-block">
                    <div className="main-headline">
                      <SplitText
                        text="Instituto Tecnológico"
                        className="main-headline-animated"
                        delay={150}
                        animationFrom={{
                          opacity: 0,
                          transform: "translate3d(0,50px,0)",
                        }}
                        animationTo={{
                          opacity: 1,
                          transform: "translate3d(0,0,0)",
                        }}
                        // CORRECCIÓN: Pasamos el array de Bézier directamente para evitar el Runtime Error
                        easing={[0.33, 1, 0.68, 1]}
                        threshold={0.2}
                        rootMargin="-50px"
                      />
                    </div>
                    <span className="sub-headline">De Ensenada</span>
                  </div>
                  <div className="slide-info">
                    <div className="category-badge">{item.categoria}</div>
                    <div className="name">{item.titulo}</div>
                    <div className="des">{item.descripcion}</div>

                    <button
                      onClick={() => router.push("/designs/vistaLogin")}
                      className="hero-btn"
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-buttons">
            <button onClick={handlePrev}>
              <FaAngleLeft />
            </button>
            <button onClick={handleNext}>
              <FaAngleRight />
            </button>
          </div>

          {/* WAVE DIVIDER */}
          <div className="custom-shape-divider-bottom-hero">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="shape-fill"
              ></path>
            </svg>
          </div>
        </div>

        <section className="category-cards-section" data-aos="fade-up">
          <h2 className="section-title">Participa en nuestras actividades!</h2>

          <div className="cards-grid">
            {/* Deportes */}
            <div className="card-item">
              <img
                src="/imagenes/basquet.png"
                alt="Deportes"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaFootball size={32} color="white" />
                </div>
                <h3>Deportes</h3>
                <p>Equipos competitivos</p>
              </div>
            </div>

            <div className="card-item">
              <img
                src="/imagenes/albatrocatrin.png"
                alt="Cultura"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaMasksTheater size={32} color="white" />
                </div>
                <h3>Cultura</h3>
                <p>Eventos artísticos</p>
              </div>
            </div>

            <div className="card-item">
              <img
                src="/imagenes/albatrobanda.png"
                alt="Clubs"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaUsers size={32} color="white" />
                </div>
                <h3>Clubs</h3>
                <p>Únete a la comunidad</p>
              </div>
            </div>

            <div className="card-item">
              <img
                src="/imagenes/voluntariado.png"
                alt="Voluntariado"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaHandHoldingHeart size={32} color="white" />
                </div>
                <h3>Voluntariado</h3>
                <p>Contribuye a causas sociales</p>
              </div>
            </div>

            <div className="card-item">
              <img
                src="/imagenes/albatroreally.png"
                alt="Talleres"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaChalkboardUser size={32} color="white" />
                </div>
                <h3>Talleres</h3>
                <p>Desarrolla nuevas habilidades</p>
              </div>
            </div>

            <div className="card-item">
              <img
                src="/imagenes/eventos.png"
                alt="Eventos"
                className="card-img"
              />
              <div className="card-content">
                <div className="card-icon">
                  <FaCalendarCheck size={32} color="white" />
                </div>
                <h3>Eventos</h3>
                <p>Todo el año</p>
              </div>
            </div>
          </div>
        </section>

        <section className="activities-section">
          <h2>¡Activa tu Experiencia ITE!</h2>

          <div className="activities-content">
            <div className="activity-item reverse" data-aos="fade-right">
              <div className="text-content">
                <h3 className="activity-title">Actividades Extraescolares</h3>
                <p className="activity-description">
                  En el Instituto Tecnológico de Ensenada, ofrecemos una
                  variedad de actividades extraescolares diseñadas para
                  enriquecer tu experiencia educativa...
                </p>
              </div>

              <div className="image-content">
                <img
                  src="/imagenes/inie.jpg"
                  alt="Actividades"
                  className="activity-image"
                />
              </div>
            </div>

            <div className="activity-item reverse" data-aos="fade-left">
              <div className="image-content">
                <img
                  src="/imagenes/inia.jpg"
                  alt="Eventos"
                  className="activity-image"
                />
              </div>

              <div className="text-content">
                <h3 className="activity-title">Eventos</h3>
                <p className="activity-description">
                  ¡No te pierdas los emocionantes eventos del Instituto
                  Tecnológico de Ensenada!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="activities-section">
          <h2>Actividades de tu interés</h2>

          <p className="activity-description">
            Nos interesa conocer tu opinión y saber qué actividades te llaman
            más la atención como aspirante al Instituto Tecnológico de Ensenada.
            Tu respuesta nos ayudará a ofrecerte opciones acordes a tus gustos e
            intereses.
          </p>

          <p className="qr-text">
            Si estás navegando desde una computadora, escanea el código QR para
            responder la encuesta desde tu celular o haz clic en el boton para
            abrir
            <br />
          </p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(formUrl)}`}
            alt="Código QR de la encuesta de intereses para aspirantes"
            className="qr-image"
          />

          <small>
            Encuesta dirigida únicamente a aspirantes de nuevo ingreso
          </small>
          <div>
            <button
              className="hero-btn"
              onClick={() => window.open(formUrl, "_blank")}
            >
              Contestar encuesta
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
