import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const HARDCODED = {
  NodalTec: "eventosadmin2025",
  SubAdmin: "subadmin2025",
  SubAdminTec: "admintec2026",
};

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Escribe usuario y contraseña" },
      { status: 400 },
    );
  }

  try {
    // 1. Buscar en BD primero
    const adminCred = await prisma.adminCredentials.findUnique({
      where: { username },
    });

    if (adminCred) {
      const isValid = await bcrypt.compare(password, adminCred.password);
      if (!isValid) {
        return NextResponse.json(
          { message: "Usuario o contraseña incorrectos" },
          { status: 401 },
        );
      }
      return NextResponse.json({ ok: true, username });
    }

    // 2. Fallback a hardcoded
    const hardcodedPass = HARDCODED[username];
    if (!hardcodedPass || hardcodedPass !== password) {
      return NextResponse.json(
        { message: "Usuario o contraseña incorrectos" },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true, username });
  } catch (error) {
    console.error("❌ Error en adminLogin:", error);
    return NextResponse.json(
      { message: "Error del servidor" },
      { status: 500 },
    );
  }
}