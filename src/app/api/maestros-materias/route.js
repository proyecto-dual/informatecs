import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const percve = new URL(req.url).searchParams.get("percve");

    if (!percve)
      return NextResponse.json({ message: "Falta el ID del maestro" }, { status: 400 });

    const materias = await prisma.actividades.findMany({
      where: { maestroId: parseInt(percve) },
      include: {
        maestro: true,
        inscripact: {
          include: {
            estudiante: {
              include: {
                inscripciones: {
                  include: { carrera: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(materias);
  } catch (error) {
    console.error(" Error al obtener materias del maestro:", error.message);
    return NextResponse.json(
      { message: "Error al obtener materias", error: error.message },
      { status: 500 },
    );
  }
}