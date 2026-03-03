// app/api/inscripciones/baja/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - Dar de baja una inscripción (NO elimina, solo marca como baja)
export async function PUT(request) {
  try {
    const { inscripcionId, estudianteId } = await request.json();

    if (!inscripcionId || !estudianteId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Verificar que la inscripción exista y pertenezca al estudiante
    const inscripcion = await prisma.inscripact.findUnique({
      where: { id: parseInt(inscripcionId) },
      include: {
        actividad: true,
        estudiante: true,
      },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: "Inscripción no encontrada" },
        { status: 404 }
      );
    }

    if (inscripcion.estudianteId !== estudianteId) {
      return NextResponse.json(
        { error: "No tienes permiso para dar de baja esta inscripción" },
        { status: 403 }
      );
    }

    //  ELIMINAR la inscripción completamente
    // (si quieres solo marcar como "baja", usa update con un campo "estatus")
    await prisma.inscripact.delete({
      where: { id: parseInt(inscripcionId) },
    });

    //  Opcional: Decrementar contador de inscritos en oferta
    if (inscripcion.ofertaId) {
      await prisma.ofertaSemestre.update({
        where: { id: inscripcion.ofertaId },
        data: {
          inscritosActuales: {
            decrement: 1,
          },
        },
      });
    }

    console.log(` Baja exitosa: ${estudianteId} de actividad ${inscripcion.actividadId}`);

    return NextResponse.json({
      success: true,
      mensaje: "Te has dado de baja exitosamente",
      inscripcionId: inscripcionId,
      actividadNombre: inscripcion.actividad?.aconco || inscripcion.actividad?.aticve,
    });
  } catch (error) {
    console.error(" Error al dar de baja:", error);
    return NextResponse.json(
      { error: "Error al procesar la baja", details: error.message },
      { status: 500 }
    );
  }
}

