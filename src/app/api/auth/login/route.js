// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { matricula, password } = body;

    if (!matricula || !password) {
      return NextResponse.json(
        { message: "Matrícula y contraseña son requeridas." },
        { status: 400 },
      );
    }

    // 1. Buscar estudiante con relaciones
    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr: matricula },
      include: {
        inscripciones: {
          include: { carrera: true },
        },
      },
    });

    if (!estudiante) {
      return NextResponse.json(
        { message: "Matrícula no encontrada" },
        { status: 404 },
      );
    }

    // 2. Buscar/Crear en authStudents
    let student = await prisma.authStudents.findUnique({
      where: { matricula },
    });

    if (!student) {
      const nombreCompleto = [
        estudiante.alunom,
        estudiante.aluapp,
        estudiante.aluapm,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      const hashedPassword = await bcrypt.hash("123456", 10);
      student = await prisma.authStudents.create({
        data: {
          matricula,
          password: hashedPassword,
          nombreCompleto,
          correo: estudiante.alumai || "",
          isVerified: true,
        },
      });
    }


    const passwordMatch = await bcrypt.compare(password, student.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    // 4. Procesar inscripción y carrera
    const inscripciones = Array.isArray(estudiante.inscripciones)
      ? estudiante.inscripciones
      : [estudiante.inscripciones].filter(Boolean);

    const inscripcionPrincipal = inscripciones[0] || {};
    const carrera = inscripcionPrincipal.carrera;

    // 5. Construir perfil completo
    const perfilCompleto = {
      numeroControl: estudiante.aluctr,
      nombreCompleto: [estudiante.alunom, estudiante.aluapp, estudiante.aluapm]
        .filter(Boolean)
        .join(" ")
        .trim(),
      fechaNacimiento: estudiante.alunac,
      rfc: estudiante.alurfc,
      curp: estudiante.alucur,
      telefono: estudiante.alute1,
      email: estudiante.alumai,
      sangre: estudiante.alutsa || "No disponible",
      creditosAprobados: Number(inscripcionPrincipal.calcac || 0),
      sexo:
        estudiante.alusex === 1
          ? "Masculino"
          : estudiante.alusex === 2
            ? "Femenino"
            : "No especificado",
      semestre: estudiante.alusme?.toString() || "No disponible",
      carrera: carrera?.carnom || "Sin carrera asignada",
      carreraId: carrera?.carcve?.toString() || null,
      inscripciones,
    };

    return NextResponse.json({
      message: `Bienvenido, ${student.nombreCompleto}`,
      nombre: student.nombreCompleto,
      estudiante: perfilCompleto,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error interno", error: error.message },
      { status: 500 },
    );
  }
}