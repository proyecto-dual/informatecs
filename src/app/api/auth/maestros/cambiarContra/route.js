import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";



export async function POST(req) {
  try {
    const { percve, newPassword } = await req.json();

    console.log(" Cambiando contraseña para percve:", percve);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.authMaestros.update({
      where: { percve: parseInt(percve) },
      data: {
        password: hashedPassword,
        isVerified: true,
        emailCode: null,
      },
    });

    console.log(" Contraseña actualizada exitosamente");

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error(" Error al cambiar contraseña:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}
