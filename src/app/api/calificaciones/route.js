import { prisma } from "@/lib/prisma";

const jsonRes = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });

const dbErrorRes = (error) => {
  if (error.code === "P1001")
    return jsonRes({ error: "No se puede conectar a la base de datos", code: "DB_CONNECTION_ERROR" }, 503);
  return null;
};

// GET - Obtener calificaciones
export async function GET(request) {
  try {
    const actividadId = new URL(request.url).searchParams.get("actividadId");
    if (!actividadId)
      return jsonRes({ error: "actividadId es requerido" }, 400);

    const inscripciones = await prisma.inscripact.findMany({
      where: { actividadId: parseInt(actividadId) },
      include: { estudiante: true },
    });

    return jsonRes(inscripciones);
  } catch (error) {
    console.error(" Error en GET /api/calificaciones:", error.message);
    return dbErrorRes(error) ?? jsonRes([], 500);
  }
}

// PUT - Actualizar calificaciones
export async function PUT(request) {
  try {
    const { actividadId, calificaciones } = await request.json();

    if (!actividadId || !calificaciones)
      return jsonRes({ error: "Datos incompletos" }, 400);

    if (typeof calificaciones !== "object" || Array.isArray(calificaciones))
      return jsonRes({ error: "Formato de calificaciones inválido" }, 400);

    const resultados = { exitosos: 0, fallidos: 0, errores: [] };

    for (const [aluctr, datos] of Object.entries(calificaciones)) {
      try {
        const inscripcion = await prisma.inscripact.findFirst({
          where: { estudianteId: aluctr, actividadId: parseInt(actividadId) },
        });

        if (!inscripcion) {
          resultados.fallidos++;
          resultados.errores.push({ numeroControl: aluctr, mensaje: "Inscripción no encontrada" });
          continue;
        }

        await prisma.inscripact.update({
          where: { id: inscripcion.id },
          data: {
            calificacion: datos.calificacion !== null && datos.calificacion !== ""
              ? parseFloat(datos.calificacion)
              : null,
            formularioData: {
              ...(inscripcion.formularioData || {}),
              observaciones: datos.observaciones || null,
            },
          },
        });

        resultados.exitosos++;
      } catch (err) {
        console.error(` Error al actualizar ${aluctr}:`, err.message);
        resultados.fallidos++;
        resultados.errores.push({ numeroControl: aluctr, mensaje: err.message || "Error desconocido" });
      }
    }

    return jsonRes({
      mensaje: `Actualización completada: ${resultados.exitosos} exitosos, ${resultados.fallidos} fallidos`,
      guardadas: resultados.exitosos,
      resultados,
    }, resultados.exitosos > 0 ? 200 : 500);
  } catch (error) {
    console.error(" Error en PUT /api/calificaciones:", error.message);
    return dbErrorRes(error) ?? jsonRes({ error: "Error al guardar calificaciones", detalles: error.message }, 500);
  }
}