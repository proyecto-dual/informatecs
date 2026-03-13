import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    // 1. Validaciones iniciales
    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Token y contraseña son requeridos." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 },
      );
    }

    // 2. Validar existencia y estado del token
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

    if (new Date(record.expiresAt) < new Date()) {
      return NextResponse.json(
        { message: "El enlace ha expirado." },
        { status: 400 },
      );
    }

    // 3. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Transacción atómica: Actualizar contraseña y marcar token como usado
    // Usamos $transaction para asegurar que si algo falla, no se marque el token como usado
    await prisma.$transaction([
      // Upsert: Actualiza si existe, crea si no (basado en el username)
      prisma.adminCredentials.upsert({
        where: { username: record.username },
        update: { password: hashedPassword },
        create: {
          username: record.username,
          password: hashedPassword,
        },
      }),
      // Marcar token como usado
      prisma.adminRecoveryToken.update({
        where: { token },
        data: { used: true },
      }),
    ]);

    console.log(`✅ Contraseña actualizada para: ${record.username}`);

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("❌ [adminReset] Error:", error);
    return NextResponse.json(
      {
        message: "Error interno al procesar la solicitud.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
