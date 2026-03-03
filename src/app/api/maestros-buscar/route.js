import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const query = new URL(req.url).searchParams.get("q") || "";

    const maestros = await prisma.maestros.findMany({
      where: {
        OR: [
          { percve: { equals: parseInt(query) || 0 } },
          { pernom: { contains: query, mode: "insensitive" } },
          { perapp: { contains: query, mode: "insensitive" } },
          { perapm: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        percve: true,
        pernom: true,
        perapp: true,
        perapm: true,
        perdce: true,
        perdep: true,
      },
    });

    return NextResponse.json(
      maestros.map((m) => ({
        id: m.percve,
        nombreCompleto: `${m.pernom || ""} ${m.perapp || ""} ${m.perapm || ""}`.trim(),
        correo: m.perdce,
        departamento: m.perdep,
      }))
    );
  } catch (error) {
    console.error(" Error al buscar maestros:", error.message);
    return NextResponse.json(
      { message: "Error al buscar maestros", error: error.message },
      { status: 500 }
    );
  }
}