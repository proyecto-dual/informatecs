import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function generarFolio() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, "0");
  return `ITE-${year}-${random}`;
}

function generarCodigoVerificacion() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 12; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

// ============================================================================
// GET - Obtener constancias
// ============================================================================

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const numeroControl = searchParams.get("numeroControl");
    const folio = searchParams.get("folio");
    const codigo = searchParams.get("codigo");

    if (numeroControl) {
      const constancias = await prisma.constancias.findMany({
        where: { numeroControl },
        orderBy: { fechaEmision: "desc" },
        include: {
          actividad: true,
        },
      });
      return NextResponse.json(constancias);
    }

    if (folio || codigo) {
      const constancia = await prisma.constancias.findFirst({
        where: folio ? { folio } : { codigoVerificacion: codigo },
        include: {
          estudiante: true,
          actividad: true,
        },
      });

      if (!constancia) {
        return NextResponse.json(
          { valid: false, error: "No encontrada" },
          { status: 404 },
        );
      }

      return NextResponse.json({ valid: true, constancia });
    }

    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================================================
// POST - Generar nueva constancia
// ============================================================================

// ... (funciones auxiliares generarFolio y generarCodigoVerificacion se mantienen igual)

export async function POST(request) {
  try {
    const { numeroControl, actividadId, acreditacion, periodo } =
      await request.json();

    if (!numeroControl || !actividadId || !acreditacion) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 },
      );
    }

    // 1. Verificar Estudiante
    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr: numeroControl },
    });

    if (!estudiante) {
      return NextResponse.json(
        { error: "Estudiante no encontrado" },
        { status: 404 },
      );
    }

    // 2. Verificar Actividad
    const actividad = await prisma.actividades.findUnique({
      where: { id: parseInt(actividadId) },
    });

    if (!actividad) {
      return NextResponse.json(
        { error: "Actividad no encontrada" },
        { status: 404 },
      );
    }

    // 3. VALIDACIÓN CORREGIDA: Verificar si ESTE alumno ya tiene ESTA actividad
    const constanciaExistente = await prisma.constancias.findFirst({
      where: {
        numeroControl: numeroControl, // Filtramos por el alumno actual
        actividadId: parseInt(actividadId), // Y por la actividad actual
      },
    });

    if (constanciaExistente) {
      return NextResponse.json(
        {
          error:
            "Este alumno ya tiene una constancia generada para esta actividad.",
          folioExistente: constanciaExistente.folio,
        },
        { status: 400 },
      );
    }

    // 4. Verificar Inscripción Aprobada
    const inscripcion = await prisma.inscripact.findFirst({
      where: {
        estudianteId: numeroControl,
        actividadId: parseInt(actividadId),
        calificacion: { gte: 70 },
      },
    });

    if (!inscripcion) {
      return NextResponse.json(
        { error: "El alumno no tiene esta actividad aprobada." },
        { status: 400 },
      );
    }

    // 5. Generar Identificadores
    let folio = generarFolio();
    let codigoVerificacion = generarCodigoVerificacion();

    // 6. Crear la Constancia
    const nuevaConstancia = await prisma.constancias.create({
      data: {
        folio,
        codigoVerificacion,
        numeroControl: estudiante.aluctr,
        nombreCompleto:
          `${estudiante.alunom} ${estudiante.aluapp} ${estudiante.aluapm || ""}`.trim(),
        correoEstudiante: estudiante.alumai || "",
        actividadId: actividad.id,
        actividadNombre: actividad.acodes || "Actividad Complementaria",
        actividadCodigo: actividad.acocve || "",
        actividadCreditos: actividad.acocre || 0,
        actividadHoras: actividad.acohrs || 0,
        periodo: periodo || "No especificado",
        acreditacion,
        estudianteId: estudiante.aluctr,
        asesor: "Juan Carlos Leal Nodal",
        fechaEmision: new Date(),
      },
    });

    return NextResponse.json({ success: true, constancia: nuevaConstancia });
  } catch (error) {
    console.error(" Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}
// ============================================================================
// DELETE - Eliminar constancia
// ============================================================================

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const eliminado = await prisma.constancias.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true, folio: eliminado.folio });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
