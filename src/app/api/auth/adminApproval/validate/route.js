// app/api/auth/adminApproval/validate/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/auth/adminApproval/validate?token=xxxxx
// Llamado por AdminApprovalPage al cargar para verificar si el token es válido
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "No se proporcionó ningún token." },
        { status: 400 },
      );
    }

    // Buscar token en BD
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    // Token no existe
    if (!record) {
      return NextResponse.json(
        { valid: false, message: "El enlace no es válido o ya fue utilizado." },
        { status: 404 },
      );
    }

    // Token ya fue usado
    if (record.used) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "Este enlace ya fue utilizado. Solicita uno nuevo si lo necesitas.",
        },
        { status: 400 },
      );
    }

    // Token expirado
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "El enlace ha expirado. Solicita uno nuevo desde el panel de login.",
        },
        { status: 400 },
      );
    }

    // Token válido → devolver el username para mostrarlo en la UI
    return NextResponse.json({
      valid: true,
      username: record.username,
    });
  } catch (error) {
    console.error("[adminApproval/validate] Error:", error);
    return NextResponse.json(
      { valid: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
