// app/api/auth/adminReset/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/auth/adminReset?token=xxx  → valida el token
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

    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    if (!record)
      return NextResponse.json(
        { valid: false, message: "El enlace no es válido." },
        { status: 404 },
      );
    if (record.used)
      return NextResponse.json(
        { valid: false, message: "Este enlace ya fue utilizado." },
        { status: 400 },
      );
    if (record.expiresAt < new Date())
      return NextResponse.json(
        { valid: false, message: "El enlace ha expirado. Solicita uno nuevo." },
        { status: 400 },
      );

    return NextResponse.json({ valid: true, username: record.username });
  } catch (error) {
    console.error("[adminReset GET] Error:", error);
    return NextResponse.json(
      { valid: false, message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}

// POST /api/auth/adminReset  → guarda la nueva contraseña
// Body: { token, newPassword, confirmPassword }
export async function POST(req) {
  try {
    const { token, newPassword, confirmPassword } = await req.json();

    if (!token || !newPassword)
      return NextResponse.json(
        { message: "Token y contraseña son requeridos." },
        { status: 400 },
      );
    if (newPassword !== confirmPassword)
      return NextResponse.json(
        { message: "Las contraseñas no coinciden." },
        { status: 400 },
      );
    if (newPassword.length < 6)
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );

    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "El enlace no es válido o ha expirado." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.adminCredentials.update({
        where: { username: record.username },
        data: { password: hashedPassword },
      }),
      prisma.adminRecoveryToken.update({
        where: { token },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({
      message:
        "✅ Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("[adminReset POST] Error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
