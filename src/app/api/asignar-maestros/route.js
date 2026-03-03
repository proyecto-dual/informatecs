import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// busca actividad por ID  o por codigo
async function findActividad(actividadId) {
  if (!isNaN(actividadId)) {
    const porId = await prisma.actividades.findUnique({
      where: { id: parseInt(actividadId) },
    });
    if (porId) return porId;
  }
  return prisma.actividades.findFirst({
    where: { aticve: actividadId },
  });
}

export async function POST(req) {
  try {
    const { actividadId, maestroId } = await req.json();

    const actividadExistente = await findActividad(actividadId);
    if (!actividadExistente)
      return NextResponse.json({ message: "Actividad no encontrada" }, { status: 404 });

    const actividad = await prisma.actividades.update({
      where: { id: actividadExistente.id },
      data: { maestroId: parseInt(maestroId) },
      include: { maestro: true },
    });

    return NextResponse.json({ message: "Maestro asignado correctamente", actividad });
  } catch (error) {
    console.error(" Error al asignar maestro:", error.message);
    return NextResponse.json({ message: "Error al asignar maestro", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const actividadId = searchParams.get("actividadId");

    const actividadExistente = await findActividad(actividadId);
    if (!actividadExistente)
      return NextResponse.json({ message: "Actividad no encontrada" }, { status: 404 });

    await prisma.actividades.update({
      where: { id: actividadExistente.id },
      data: { maestroId: null },
    });

    return NextResponse.json({ message: "Maestro removido correctamente" });
  } catch (error) {
    console.error("Error al remover maestro:", error.message);
    return NextResponse.json({ message: "Error al remover maestro", error: error.message }, { status: 500 });
  }
}