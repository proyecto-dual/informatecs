import { useState } from "react";

export const useInscripcion = () => {
  const [formSport, setFormSport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hasCondition: "",
    conditionDetails: "",
    takesMedication: "",
    medicationDetails: "",
    hasAllergy: "",
    allergyDetails: "",
    hasInjury: "",
    injuryDetails: "",
    hasRestriction: "",
    restrictionDetails: "",
  });

  const iniciarInscripcion = async (sport, numeroControl) => {
    try {
      const response = await fetch(
        `/api/inscripciones?aluctr=${numeroControl}`
      );
      const inscripciones = await response.json();

      const yaInscrito = inscripciones.some(
        (insc) => insc.actividadId === sport.actividadId
      );

      if (yaInscrito) {
        alert("Ya estás inscrito en esta actividad");
        return;
      }

      setFormSport(sport);
      setShowForm(true);
      setFormData({
        hasCondition: "",
        conditionDetails: "",
        takesMedication: "",
        medicationDetails: "",
        hasAllergy: "",
        allergyDetails: "",
        hasInjury: "",
        injuryDetails: "",
        hasRestriction: "",
        restrictionDetails: "",
      });
    } catch (error) {
      alert("Error al verificar inscripciones");
    }
  };

  const cancelarInscripcion = () => {
    setShowForm(false);
    setFormSport(null);
    setFormData({
      hasCondition: "",
      conditionDetails: "",
      takesMedication: "",
      medicationDetails: "",
      hasAllergy: "",
      allergyDetails: "",
      hasInjury: "",
      injuryDetails: "",
      hasRestriction: "",
      restrictionDetails: "",
    });
  };

  const submitInscripcion = async (studentData, updateBloodType, formDataFromChild) => {
    if (!formSport) {
      alert("Error: No se ha seleccionado ninguna actividad");
      return;
    }

    if (!formSport.actividadId || (!formSport.id && !formSport.ofertaId)) {
      alert("Error: Datos de actividad incompletos");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        aluctr: studentData.numeroControl,
        actividadId: formSport.actividadId,
        ofertaId: formSport.ofertaId || formSport.id,
        ...formDataFromChild,
      };

      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al inscribir");
      }

      alert("¡Inscripción exitosa!");
      cancelarInscripcion();

      return data;
    } catch (error) {
      alert(error.message || "Error al procesar la inscripción");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formSport,
    showForm,
    isSubmitting,
    formData,
    setFormData,
    iniciarInscripcion,
    cancelarInscripcion,
    submitInscripcion,
  };
};