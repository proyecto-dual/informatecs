// src/app/api/auth/adminReset/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Body recibido:", {
      token: body.token?.slice(0, 10) + "...",
      newPassword: body.newPassword ? "✅ recibida" : "❌ vacía",
    });

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

    // 1. Buscar token en BD
    const record = await prisma.adminRecoveryToken.findUnique({
      where: { token },
    });
    console.log(
      "🔍 Token encontrado:",
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

    // 2. Hashear la contraseña nueva (NO el token)
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(
      "🔐 newPassword hasheada correctamente, longitud hash:",
      hashedPassword.length,
    );

    // 3. Guardar en AdminCredentials
    const existing = await prisma.adminCredentials.findUnique({
      where: { username: record.username },
    });
    console.log(
      "📋 AdminCredentials existente:",
      existing ? `id=${existing.id}` : "NO EXISTE, se creará",
    );

    let result;
    if (existing) {
      result = await prisma.adminCredentials.update({
        where: { username: record.username },
        data: { password: hashedPassword }, // ← solo el hash, nunca el token
      });
    } else {
      result = await prisma.adminCredentials.create({
        data: {
          username: record.username,
          password: hashedPassword, // ← solo el hash, nunca el token
        },
      });
    }
    console.log(
      "✅ Guardado en BD, id:",
      result.id,
      "username:",
      result.username,
    );

    // 4. Marcar token como usado
    await prisma.adminRecoveryToken.update({
      where: { token },
      data: { used: true },
    });
    console.log("🔒 Token marcado como usado");

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
