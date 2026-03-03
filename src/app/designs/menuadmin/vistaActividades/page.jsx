"use client";
import Formulario from "@/app/components/forms/formulario";
import React from "react";

const ActividadForm = ({
  selectedSport,
  formData,
  setFormData,
  handleSubmit,
  cancelar,
}) => {
  return (
    <Formulario
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      cancelar={cancelar}
    />
  );
};

export default ActividadForm;
