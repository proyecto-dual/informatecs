import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get("user");

  if (!user) return NextResponse.json({ permisos: [] });

  try {
    const aprobadas = await prisma.subAdminSolicitud.findMany({
      where: { subAdminUser: user, estado: "aprobado" },
      select: { seccion: true },
    });
    const permisos = aprobadas.map((s) => s.seccion);
    return NextResponse.json({ permisos });
  } catch {
    return NextResponse.json({ permisos: [] });
  }
}