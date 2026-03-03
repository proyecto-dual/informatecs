"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ActividadForm from "@/app/components/forms/formulario";
import "@/styles/alumno/eventos.css";
import { useStudentData } from "@/app/components/hooks/useStudentData";
import { useOfertas } from "@/app/components/hooks/useOfertas";
import { useModalHandler } from "@/app/components/hooks/useModalHandler";
import { useInscripcion } from "@/app/components/hooks/useInscripcion";
import { useCarousel } from "@/app/components/hooks/useCarousel";
import Card from "@/app/components/card";
import OfferModal from "@/app/components/offterModal";
import Image from "next/image";

export default function App() {
  const { studentData } = useStudentData();
  const { ofertas, loading, error } = useOfertas("/api/act-disponibles");

  const { selectedItem, selectedId, handleOpen, handleClose } =
    useModalHandler();

  const {
    formSport,
    showForm,
    isSubmitting,
    formData,
    setFormData,
    iniciarInscripcion,
    cancelarInscripcion,
    submitInscripcion,
  } = useInscripcion();

  const { carouselRef, scrollCarousel } = useCarousel(408);

  /* ===============================
     LÓGICA DE SEMESTRE APLICADA
     =============================== */
  const obtenerSemestreValido = () => {
    // Aplicamos la misma prioridad que en el Admon Dashboard
    const rawSem =
      studentData?.semestre || studentData?.alusme || studentData?.calnpe;
    return rawSem ? parseInt(rawSem) : null;
  };

  const handleRegister = (item) => {
    const numControl = studentData?.numeroControl || studentData?.aluctr;

    if (!numControl) {
      alert("No se pudo obtener el número de control del alumno");
      return;
    }

    // Al iniciar, inyectamos el semestre detectado en el proceso de inscripción
    const semestre = obtenerSemestreValido();

    // Pasamos los datos del estudiante extendidos
    iniciarInscripcion(item, numControl);
    handleClose();
  };

  const handleFormSubmit = async (formDataFromChild) => {
    const numControl = studentData?.numeroControl || studentData?.aluctr;

    if (!numControl) {
      alert("No se pudo obtener el número de control del alumno");
      return;
    }

    try {
      const data = new FormData();

      // --- CORRECCIÓN DE IDs ---
      // 1. El ID de la ACTIVIDAD (Suele estar dentro del objeto actividad o como actividadId)
      const realActividadId = formSport.actividadId || formSport.actividad?.id;

      // 2. El ID de la OFERTA (Es el ID principal de la tarjeta que seleccionaste)
      const realOfertaId = formSport.id;

      // Si por alguna razón realActividadId es null, usamos formSport.id como respaldo
      data.append("aluctr", numControl);
      data.append("actividadId", realActividadId || formSport.id);
      data.append("ofertaId", realOfertaId);

      console.log("🚀 ENVIANDO A BD:", {
        numControl,
        actividadId: realActividadId || formSport.id,
        ofertaId: realOfertaId,
      });

      // 3. Cuestionario
      data.append("purpose", formDataFromChild.purpose);
      data.append("bloodType", formDataFromChild.bloodType);
      data.append("hasCondition", formDataFromChild.hasCondition);
      data.append("takesMedication", formDataFromChild.takesMedication);
      data.append("hasAllergy", formDataFromChild.hasAllergy);
      data.append("hasInjury", formDataFromChild.hasInjury);
      data.append("hasRestriction", formDataFromChild.hasRestriction);

      // 4. Archivo
      if (formDataFromChild.bloodTypeFile instanceof File) {
        data.append("bloodTypeFile", formDataFromChild.bloodTypeFile);
      }

      const res = await fetch("/api/inscripciones", {
        method: "POST",
        body: data,
      });

      const resultado = await res.json();

      if (!res.ok)
        throw new Error(resultado.error || "Error al procesar inscripción");

      alert("¡Inscripción exitosa!");
      cancelarInscripcion();
    } catch (error) {
      console.error("Error en handleFormSubmit:", error);
      alert(error.message);
    }
  };

  if (showForm && formSport) {
    return (
      <div className="ofertas-dashboard-container">
        <main className="ofertas-dashboard-main">
          <div className="ofertas-header-with-mascot">
            <div className="ofertas-header-content">
              <h1 className="perfil-welcome-title">Ofertas del Semestre</h1>
              <p className="ofertas-subtitle">
                Estás inscribiéndote como alumno de{" "}
                {obtenerSemestreValido() || "?"}° semestre
              </p>

              <div className="ofertas-steps-indicator">
                <div className="ofertas-step completed">
                  <div className="ofertas-step-number">1</div>
                  <div className="ofertas-step-label">
                    Seleccionar actividad
                  </div>
                </div>
                <div className="ofertas-step-line completed"></div>
                <div className="ofertas-step active">
                  <div className="ofertas-step-number">2</div>
                  <div className="ofertas-step-label">Llenar formulario</div>
                </div>
                <div className="ofertas-step-line"></div>
                <div className="ofertas-step">
                  <div className="ofertas-step-number">3</div>
                  <div className="ofertas-step-label">Confirmar</div>
                </div>
              </div>
            </div>
          </div>

          <ActividadForm
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            selectedSport={formSport}
            cancelar={cancelarInscripcion}
            isSubmitting={isSubmitting}
            // Pasamos el semestre como prop por si el formulario necesita lógica interna
            currentSemester={obtenerSemestreValido()}
            // Pasamos sangre si ya existe en el perfil (visto en consola)
            initialBloodType={studentData?.sangre}
          />
        </main>
      </div>
    );
  }

  /* ===============================
     VISTA PRINCIPAL (PASO 1)
     =============================== */
  return (
    <div className="ofertas-dashboard-container">
      <main className="ofertas-dashboard-main">
        <div className="ofertas-header-with-mascot">
          <div className="ofertas-header-content">
            <h1>Ofertas del Semestre</h1>
            <p className="ofertas-subtitle">
              Explora las actividades disponibles y regístrate fácilmente
            </p>

            <div className="ofertas-steps-indicator">
              <div className="ofertas-step active">
                <div className="ofertas-step-number">1</div>
                <div className="ofertas-step-label">Seleccionar actividad</div>
              </div>
              <div className="ofertas-step-line completed"></div>
              <div className="ofertas-step">
                <div className="ofertas-step-number">2</div>
                <div className="ofertas-step-label">Llenar formulario</div>
              </div>
              <div className="ofertas-step-line"></div>
              <div className="ofertas-step">
                <div className="ofertas-step-number">3</div>
                <div className="ofertas-step-label">
                  Confirmar en "Mis Actividades"
                </div>
              </div>
            </div>
          </div>

          <div className="ofertas-mascota-container">
            <Image
              src="/imagenes/eventos.png"
              alt="Mascota Albatros"
              width={180}
              height={180}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-container">Cargando ofertas...</div>
        ) : error ? (
          <p>Error: {error}</p>
        ) : ofertas.length > 0 ? (
          <div className="ofertas-carousel-container">
            <button
              className="ofertas-carousel-btn left"
              onClick={() => scrollCarousel("left")}
            >
              <ChevronLeft />
            </button>
            <div ref={carouselRef} className="ofertas-carousel">
              {ofertas.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={handleOpen}
                />
              ))}
            </div>
            <button
              className="ofertas-carousel-btn right"
              onClick={() => scrollCarousel("right")}
            >
              <ChevronRight />
            </button>
          </div>
        ) : (
          <p>No hay ofertas disponibles</p>
        )}

        {selectedItem && (
          <OfferModal
            item={selectedItem}
            onClose={handleClose}
            onRegister={handleRegister}
          />
        )}
      </main>
    </div>
  );
}
