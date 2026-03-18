// src/app/api/auth/adminReset/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET ?token=xxx → valida el token
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token no proporcionado." },
        { status: 400 },
      );
    }

    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    if (!record) {
      return NextResponse.json(
        { valid: false, message: "El enlace no es válido." },
        { status: 404 },
      );
    }
    if (record.used) {
      return NextResponse.json(
        { valid: false, message: "Este enlace ya fue utilizado." },
        { status: 400 },
      );
    }
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, message: "El enlace ha expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true, username: record.username });
  } catch (error) {
    console.error("[adminReset GET] Error:", error);
    return NextResponse.json(
      { valid: false, message: "Error interno." },
      { status: 500 },
    );
  }
}

// POST { token, newPassword, confirmPassword } → guarda la nueva contraseña
export async function POST(req) {
  try {
    const { token, newPassword, confirmPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Datos incompletos." },
        { status: 400 },
      );
    }
   
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Mínimo 6 caracteres." },
        { status: 400 },
      );
    }

    // 1. Validar token
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    if (!record) {
      return NextResponse.json(
        { message: "El enlace no es válido." },
        { status: 400 },
      );
    }
    if (record.used) {
      return NextResponse.json(
        { message: "Este enlace ya fue utilizado." },
        { status: 400 },
      );
    }
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "El enlace ha expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    // 2. Verificar que el admin existe
    const admin = await prisma.adminCredentials.findUnique({
      where: { username: record.username },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Administrador no encontrado." },
        { status: 404 },
      );
    }

    // 3. Hashear contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 4. Actualizar contraseña (sin transacción para evitar problemas con pooling)
    await prisma.adminCredentials.update({
      where: { username: record.username },
      data: { password: hashedPassword },
    });

    // 5. Marcar token como usado
    await prisma.adminRecoveryToken.update({
      where: { token },
      data: { used: true },
    });

    console.log(`✅ Contraseña actualizada para: ${record.username}`);

    return NextResponse.json({
      message:
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("[adminReset POST] Error completo:", error);
    return NextResponse.json(
      { message: `Error al actualizar: ${error.message}` },
      { status: 500 },
    );
  }
}
