import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { percve, pernom, perapp, perapm, perdep, perdce } = await req.json();

    if (!percve || !pernom || !perapp) {
      return NextResponse.json(
        { message: "ID, nombre y apellido paterno son obligatorios." },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const existe = await prisma.maestros.findUnique({
      where: { percve: parseInt(percve) },
    });

    if (existe) {
      return NextResponse.json(
        { message: `Ya existe un maestro con ID ${percve}.` },
        { status: 400 }
      );
    }

    const maestro = await prisma.maestros.create({
      data: {
        percve: parseInt(percve),
        pernom: pernom.trim(),
        perapp: perapp.trim(),
        perapm: perapm?.trim() || "",
        perdep: perdep?.trim() || "",
        perdce: perdce?.trim() || "",
      },
    });

    return NextResponse.json({
      id: maestro.percve,
      nombreCompleto: `${maestro.pernom} ${maestro.perapp} ${maestro.perapm}`.trim(),
      departamento: maestro.perdep,
      correo: maestro.perdce,
    });
  } catch (error) {
    console.error("[maestros POST]", error);
    return NextResponse.json(
      { message: "Error al crear maestro.", error: error.message },
      { status: 500 }
    );
  }
}