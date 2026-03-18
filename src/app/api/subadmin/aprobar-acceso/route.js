import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ?estado=pendiente|aprobado → filtra por estado
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = searchParams.get("estado") || "pendiente";

    const solicitudes = await prisma.subAdminSolicitud.findMany({
      where: { estado },
      orderBy: { creadoEn: "desc" },
    });
    return NextResponse.json({ solicitudes });
  } catch (error) {
    console.error("[aprobar-acceso GET]", error);
    return NextResponse.json({ message: "Error interno." }, { status: 500 });
  }
}

// POST { id, accion: 'aprobar' | 'rechazar' | 'bloquear' }
export async function POST(req) {
  try {
    const { id, accion } = await req.json();

    if (!id || !accion) {
      return NextResponse.json({ message: "Datos incompletos." }, { status: 400 });
    }

    const nuevoEstado =
      accion === "aprobar" ? "aprobado" :
      accion === "rechazar" ? "rechazado" :
      "pendiente"; // bloquear → vuelve a pendiente y quita el acceso

    const solicitud = await prisma.subAdminSolicitud.update({
      where: { id },
      data: { estado: nuevoEstado },
    });

    const mensajes = {
      aprobar: "Acceso aprobado correctamente.",
      rechazar: "Solicitud rechazada.",
      bloquear: "Acceso bloqueado. El sub administrador deberá volver a solicitarlo.",
    };

    return NextResponse.json({ message: mensajes[accion], solicitud });
  } catch (error) {
    console.error("[aprobar-acceso POST]", error);
    return NextResponse.json({ message: "Error interno." }, { status: 500 });
  }
}