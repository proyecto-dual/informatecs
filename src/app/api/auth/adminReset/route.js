// src/app/api/auth/adminReset/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

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

    // 1. Buscar y validar token
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });
    console.log(
      "🔍 Token:",
      record
        ? `username=${record.username}, used=${record.used}`
        : "NO ENCONTRADO",
    );

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

    // 2. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔐 Hash generado para:", record.username);

    // 3. Guardar en AdminCredentials
    const existing = await prisma.adminCredentials.findUnique({
      where: { username: record.username },
    });

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
    console.log("✅ Contraseña actualizada en BD para:", result.username);

    // 4. Marcar token como usado
    await prisma.adminRecoveryToken.update({
      where: { token },
      data: { used: true },
    });

    return NextResponse.json({
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    console.error("❌ [adminReset] Error:", error.message);
    return NextResponse.json(
      { message: `Error al guardar: ${error.message}` },
      { status: 500 },
    );
  }
}
