// services/constanciaService.js

export const ConstanciaService = {
  /**
   * Filtra estudiantes únicos y determina si tienen actividades aprobadas (>= 70)
   */
  procesarListaEstudiantes(inscripciones) {
    if (!Array.isArray(inscripciones)) return [];

    const estudiantesUnicos = new Map();

    inscripciones.forEach((inscripcion) => {
      const estudiante = inscripcion?.estudiante;
      if (estudiante && estudiante.aluctr) {
        if (!estudiantesUnicos.has(estudiante.aluctr)) {
          // Filtramos las actividades de este estudiante específico
          const actividadesDelEstudiante = inscripciones.filter(
            (i) => i?.estudiante?.aluctr === estudiante.aluctr,
          );

          const tieneAprobada = actividadesDelEstudiante.some(
            (i) => (i.calificacion || 0) >= 70,
          );

          estudiantesUnicos.set(estudiante.aluctr, {
            ...estudiante,
            tieneActividadAprobada: tieneAprobada,
            totalActividades: actividadesDelEstudiante.length,
            actividadesAprobadas: actividadesDelEstudiante.filter(
              (i) => (i.calificacion || 0) >= 70,
            ).length,
          });
        }
      }
    });

    return Array.from(estudiantesUnicos.values()).sort((a, b) =>
      (a.aluctr || "").localeCompare(b.aluctr || ""),
    );
  },

  /**
   * Determina la unidad de medida (Horas/Créditos) según el propósito
   */
  obtenerUnidadAcreditacion(proposito) {
    return proposito === "servicio_social" ? "Horas" : "Créditos";
  },

  /**
   * Realiza la petición POST a la API consolidada para generar la constancia
   */
  async generarConstancia(datos) {
    const response = await fetch("/api/constancias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al generar constancia");
    }

    return await response.json();
  },

  /**
   * Obtiene las constancias de un estudiante usando API consolidada
   */
  async obtenerConstanciasEstudiante(numeroControl) {
    const response = await fetch(
      `/api/constancias?numeroControl=${numeroControl}`,
    );

    if (!response.ok) {
      throw new Error("Error al obtener constancias");
    }

    return await response.json();
  },

  /**
   * Verifica una constancia por folio usando API consolidada
   */
  async verificarConstancia(folio) {
    const response = await fetch(`/api/constancias?folio=${folio}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al verificar constancia");
    }

    return await response.json();
  },

  /**
   * Obtiene las actividades aprobadas de un estudiante que NO tienen constancia
   */
  async obtenerActividadesSinConstancia(numeroControl) {
    try {
      // Obtener inscripciones del estudiante
      const resInscripciones = await fetch(
        `/api/inscripciones?numeroControl=${numeroControl}`,
      );
      const inscripciones = await resInscripciones.json();

      // Filtrar solo aprobadas (cal >= 70)
      const aprobadas = inscripciones.filter(
        (i) => (i.calificacion || 0) >= 70,
      );

      // Obtener constancias existentes usando API consolidada
      const constancias =
        await this.obtenerConstanciasEstudiante(numeroControl);
      const idsConConstancia = new Set(constancias.map((c) => c.actividadId));

      // Retornar actividades aprobadas sin constancia
      return aprobadas.filter((i) => !idsConConstancia.has(i.actividadId));
    } catch (error) {
      console.error("Error al obtener actividades sin constancia:", error);
      throw error;
    }
  },
};
