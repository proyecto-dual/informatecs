import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const percve = parseInt(searchParams.get("percve"));

  if (!percve || isNaN(percve)) {
    return NextResponse.json({ error: "percve requerido" }, { status: 400 });
  }

  try {
    // DEBUG 1: Ver todas las actividades del maestro sin ningún filtro
    const todasActividades = await prisma.actividades.findMany({
      where: { maestroId: percve },
    });
    console.log("=== DEBUG ===");
    console.log("percve recibido:", percve, "| tipo:", typeof percve);
    console.log(
      "Actividades del maestro:",
      JSON.stringify(todasActividades, null, 2),
    );

    // DEBUG 2: Ver todas las ofertas sin filtro de activa
    const todasOfertas = await prisma.ofertaSemestre.findMany({
      where: {
        actividad: {
          maestroId: percve,
        },
      },
      include: { actividad: true },
    });
    console.log(
      "Todas las ofertas (sin filtro activa):",
      JSON.stringify(todasOfertas, null, 2),
    );

    // Filtra activas en JS para evitar problemas con el where de Prisma
    const ofertasActivas = todasOfertas.filter((o) => o.activa === true);

    const totalMaterias = ofertasActivas.length;

    const horasSemana = ofertasActivas.reduce((acc, oferta) => {
      return acc + (oferta.actividad?.acohrs || 0);
    }, 0);

    const ofertaIds = ofertasActivas.map((o) => o.id);

    const totalEstudiantes =
      ofertaIds.length > 0
        ? await prisma.inscripact.count({
            where: {
              ofertaId: { in: ofertaIds },
            },
          })
        : 0;

    const hoy = new Date();
    const inicioCiclo = new Date(hoy.getFullYear(), 0, 13);
    const diffMs = hoy - inicioCiclo;
    const semanaActual = Math.max(
      1,
      Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000)),
    );

    return NextResponse.json({
      materias: totalMaterias,
      horasSemana,
      estudiantes: totalEstudiantes,
      semana: semanaActual,
    });
  } catch (error) {
    console.error("Error al obtener stats del maestro:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
