import { prisma } from '@/lib/prisma';
// POST - Calificar estudiante individual
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.inscripcionId || body.calificacion === undefined) {
      return new Response(
        JSON.stringify({ error: "Faltan datos requeridos (inscripcionId, calificacion)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar rango de calificación
    const calificacion = parseFloat(body.calificacion);
    if (calificacion < 0 || calificacion > 100) {
      return new Response(
        JSON.stringify({ error: "La calificación debe estar entre 0 y 100" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar que la inscripción existe
    const inscripcionExistente = await prisma.inscripact.findUnique({
      where: { id: body.inscripcionId },
      include: {
        estudiante: {
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true,
          }
        },
        actividad: {
          select: {
            aconco: true,
            aticve: true,
          }
        }
      }
    });

    if (!inscripcionExistente) {
      return new Response(
        JSON.stringify({ error: "Inscripción no encontrada" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualizar calificación
    const inscripcion = await prisma.inscripact.update({
      where: { id: body.inscripcionId },
      data: {
        calificacion: calificacion,
        liberado: body.liberado !== undefined ? body.liberado : calificacion >= 70, // Auto-liberar si >= 70
      }
    });

    console.log(` Calificación guardada: ${inscripcionExistente.estudiante.alunom} - ${calificacion}`);

    return new Response(JSON.stringify({
      message: "Calificación guardada correctamente",
      inscripcion: {
        id: inscripcion.id,
        calificacion: inscripcion.calificacion,
        liberado: inscripcion.liberado,
        estudiante: `${inscripcionExistente.estudiante.alunom} ${inscripcionExistente.estudiante.aluapp}`,
        actividad: inscripcionExistente.actividad.aconco,
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(" Error al calificar estudiante:", error);
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT - Calificar múltiples estudiantes
export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.calificaciones || !Array.isArray(body.calificaciones)) {
      return new Response(
        JSON.stringify({ error: "Se requiere un array de calificaciones" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar todas las calificaciones
    const calificacionesValidas = body.calificaciones.every(
      c => c.inscripcionId && c.calificacion >= 0 && c.calificacion <= 100
    );

    if (!calificacionesValidas) {
      return new Response(
        JSON.stringify({ error: "Datos inválidos en calificaciones" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Actualizar en lote
    const resultados = await Promise.all(
      body.calificaciones.map(async (item) => {
        return await prisma.inscripact.update({
          where: { id: item.inscripcionId },
          data: {
            calificacion: parseFloat(item.calificacion),
            liberado: item.liberado !== undefined ? item.liberado : parseFloat(item.calificacion) >= 70,
          }
        });
      })
    );

    console.log(` ${resultados.length} calificaciones guardadas en lote`);

    return new Response(JSON.stringify({
      message: `${resultados.length} calificaciones guardadas correctamente`,
      actualizados: resultados.length
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(" Error al calificar múltiples estudiantes:", error);
    return new Response(
      JSON.stringify({ error: "Error interno", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
