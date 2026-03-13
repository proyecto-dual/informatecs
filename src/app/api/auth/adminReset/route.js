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

    // 1. Validar token
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });
    console.log("🔍 Token encontrado:", record);

    if (!record)
      return NextResponse.json(
        { message: "Enlace inválido." },
        { status: 400 },
      );
    if (record.used)
      return NextResponse.json(
        { message: "Este enlace ya fue utilizado." },
        { status: 400 },
      );
    if (record.expiresAt < new Date())
      return NextResponse.json(
        { message: "El enlace ha expirado." },
        { status: 400 },
      );

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 Hash generado para:", record.username);

    // 3. Verificar si ya existe el registro
    const existing = await prisma.adminCredentials.findUnique({
      where: { username: record.username },
    });
    console.log("📋 Registro existente en AdminCredentials:", existing);

    // 4. Guardar — update si existe, create si no
    let result;
    if (existing) {
      result = await prisma.adminCredentials.update({
        where: { username: record.username },
        data: { password: hashedPassword },
      });
    } else {
      result = await prisma.adminCredentials.create({
        data: { username: record.username, password: hashedPassword },
      });
    }
    console.log("✅ Contraseña guardada en BD:", result);

    // 5. Marcar token como usado
    await prisma.adminRecoveryToken.update({
      where: { token },
      data: { used: true },
    });
    console.log("🔒 Token marcado como usado");

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("❌ [adminReset] Error completo:", error);
    return NextResponse.json(
      { message: `Error al guardar: ${error.message}` },
      { status: 500 },
    );
  }
}
