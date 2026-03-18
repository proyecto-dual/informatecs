import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { seccion, subAdminUser } = await req.json();

    if (!seccion || !subAdminUser) {
      return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
    }

    // Verificar si ya hay una solicitud pendiente para esta sección
    const existente = await prisma.subAdminSolicitud.findFirst({
      where: { seccion, estado: "pendiente" },
    });

    if (existente) {
      return NextResponse.json({ message: "Ya existe una solicitud pendiente para esta sección." }, { status: 400 });
    }

    await prisma.subAdminSolicitud.create({
      data: {
        subAdminUser,
        seccion,
        estado: "pendiente",
      },
    });

    return NextResponse.json({ message: "Solicitud enviada correctamente." });
  } catch (error) {
    console.error("[solicitar-acceso]", error);
    return NextResponse.json({ message: "Error interno." }, { status: 500 });
  }
}