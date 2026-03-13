// src/app/api/auth/adminReset/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Datos incompletos." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );
    }

    // Validar token
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });

    if (!record) {
      return NextResponse.json(
        { message: "Enlace inválido." },
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
        { message: "El enlace ha expirado." },
        { status: 400 },
      );
    }

    // ✅ Guardar nueva contraseña hasheada en la BD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.adminCredentials.upsert({
      where: { username: record.username },
      update: { password: hashedPassword },
      create: { username: record.username, password: hashedPassword },
    });

    // Marcar token como usado para que no se pueda reutilizar
    await prisma.adminRecoveryToken.update({
      where: { token },
      data: { used: true },
    });

    console.log(`✅ Contraseña actualizada en BD para: ${record.username}`);

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("[adminReset] Error:", error);
    return NextResponse.json(
      { message: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
