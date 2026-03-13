// src/app/api/auth/adminApproval/validate/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({
      valid: false,
      message: "Token no proporcionado",
    });
  }

  const recovery = await prisma.adminRecoveryToken.findUnique({
    where: { token },
  });

  if (!recovery)
    return NextResponse.json({ valid: false, message: "Enlace inválido" });
  if (recovery.used)
    return NextResponse.json({
      valid: false,
      message: "Este enlace ya fue utilizado",
    });
  if (new Date() > recovery.expiresAt)
    return NextResponse.json({
      valid: false,
      message: "El enlace ha expirado",
    });

  return NextResponse.json({ valid: true, username: recovery.username });
}
