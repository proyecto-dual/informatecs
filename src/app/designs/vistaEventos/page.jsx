"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/layout/navbar";
import Footer from "@/app/components/layout/footer";
import { Bell } from "lucide-react";
import "@/styles/style.css";

export const dynamic = "force-dynamic";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  // ==============================
  // Cargar noticias desde API o usar ejemplo
  // ==============================
  const loadNews = async () => {
    try {
      const response = await fetch("/api/noticias", { cache: "no-store" });

      if (response.ok) {
        const jsonData = await response.json();

        if (jsonData.noticias?.length > 0) {
          // Ordenar por fecha descendente
          const sortedNews = jsonData.noticias.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha),
          );
          setData(sortedNews);
        } else {
          setDatosDeEjemplo();
        }
      } else {
        setDatosDeEjemplo();
      }
    } catch (error) {
      console.error("Error cargando noticias:", error);
      setDatosDeEjemplo();
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Datos de ejemplo (fallback)
  // ==============================
  const setDatosDeEjemplo = () => {
    const datosDeEjemplo = [
      {
        id: 1,
        titulo: "¡Gran Torneo de Fútbol Inter-Escolar! ",
        descripcion:
          "Nuestro equipo Albatros participará en el campeonato regional este sábado 16 de noviembre. Los juegos iniciarán a las 9:00 AM en las canchas principales. ¡Vamos Albatros!",
        fecha: "2024-11-16",
        imagen:
          "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 2,
        titulo: "Exposición de Ciencias 2024 - Innovación Albatros ",
        descripcion:
          "Los estudiantes de secundaria presentarán sus proyectos científicos el próximo jueves 21 de noviembre en el auditorio principal. Habrá experimentos de física, química y biología.",
        fecha: "2024-11-21",
        imagen: "./imagenes/tec4.jpg",
      },
      {
        id: 3,
        titulo: "Festival Cultural Albatros ",
        descripcion:
          "El viernes 29 de noviembre celebraremos nuestro Festival Cultural con danza, teatro, música y gastronomía típica. ¡Entrada libre para toda la comunidad!",
        fecha: "2024-11-29",
        imagen:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 4,
        titulo: "Reconocimiento a Estudiantes Destacados ",
        descripcion:
          "Felicitamos a los estudiantes Albatros que lograron primeros lugares en las Olimpiadas del Conocimiento. La ceremonia será el lunes 2 de diciembre.",
        fecha: "2024-12-02",
        imagen: "",
      },
      {
        id: 5,
        titulo: "Campaña de Reciclaje - Escuela Verde ",
        descripcion:
          "Comienza la campaña ecológica 'Albatros Verde'. Los alumnos podrán traer materiales reciclables del 4 al 15 de diciembre. ¡Participa y gana premios!",
        fecha: "2024-12-04",
        imagen:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      },
    ];

    setData(datosDeEjemplo);
  };

  // ==============================
  // Formatear fecha a español
  // ==============================
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // ==============================
  // Estado de carga
  // ==============================
  if (loading) {
    return (
      <>
        <div className="loading-container">
          <p>Cargando noticias...</p>
        </div>
        <Footer />
      </>
    );
  }

  // ==============================
  // Render principal
  // ==============================
  return (
    <>
      <header className="news-header">
        <div className="news-title-container">
          <h1 className="news-page-title">¡Noticias Albatros!</h1>
        </div>
      </header>

      <main className="news-content-container">
        {data.length === 0 ? (
          <div className="news-empty-state">
            <p>No hay noticias disponibles en este momento.</p>
          </div>
        ) : (
          <div className="news-grid">
            {data.map((element) => (
              <article key={element.id} className="news-event-block">
                {element.imagen && (
                  <div className="news-event-image-container">
                    <img
                      src={element.imagen}
                      alt={element.titulo}
                      className="event-image"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="news-event-content">
                  <h2 className="news-title">{element.titulo}</h2>
                  <p className="description">{element.descripcion}</p>
                  {element.fecha && (
                    <p className="date">{formatDate(element.fecha)}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Page;
