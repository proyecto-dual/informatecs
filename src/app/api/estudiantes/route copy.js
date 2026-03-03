import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { matricula, password } = await req.json();

    // 1. Buscar estudiante con sus relaciones
    const estudiante = await prisma.estudiantes.findUnique({
      where: { aluctr: matricula },
      include: {
        inscripciones: {
          include: {
            carrera: true,
          },
        },
      },
    });

    if (!estudiante) {
      return NextResponse.json({ message: "Matrícula no encontrada" }, { status: 404 });
    }

    // 2. Gestión de authStudents (Login persistente)
    let studentAuth = await prisma.authStudents.findUnique({
      where: { matricula },
    });

    if (!studentAuth) {
      const nombreGenerado = `${estudiante.alunom ?? ""} ${estudiante.aluapp ?? ""} ${estudiante.aluapm ?? ""}`.trim();
      const hashedDefault = await bcrypt.hash("123456", 10);

      studentAuth = await prisma.authStudents.create({
        data: {
          matricula,
          password: hashedDefault,
          nombreCompleto: nombreGenerado,
          correo: estudiante.alumai || "",
          isVerified: true,
        },
      });
    }

    // 3. Validar contraseña
    const passwordMatch = await bcrypt.compare(password, studentAuth.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    // 4. Procesar Carrera e Inscripciones
    // En tu log, inscripciones es un array. Tomamos la primera.
    const inscripcionPrincipal = estudiante.inscripciones?.[0] || {};
    const carrera = inscripcionPrincipal.carrera || {};

    // 5. Construcción del perfil garantizando SANGRE y CRÉDITOS
    const perfilCompleto = {
      numeroControl: estudiante.aluctr || "",
      nombreCompleto: studentAuth.nombreCompleto,
      fechaNacimiento: estudiante.alunac || "",
      rfc: estudiante.alurfc || "",
      curp: estudiante.alucur || "",
      telefono: estudiante.alute1 || estudiante.alute2 || "Sin teléfono",
      email: estudiante.alumai || "",
      
      // Mapeo exacto de los campos que vimos en tu log y tabla
      sangre: estudiante.alutsa || "No especificado", 
      // Si aluegr viene como null o undefined, ponemos 0
      creditosAprobados: Number(estudiante.calca || 0), 
      
      sexo:
        estudiante.alusex === 1
          ? "Masculino"
          : estudiante.alusex === 2
          ? "Femenino"
          : "No especificado",
          
      // Usamos el semestre de la inscripción actual (calnpe) si alusme está vacío
      semestre: estudiante.alusme?.toString() || inscripcionPrincipal.calnpe || "N/A",
      
      carrera: carrera.carnom || "Sin carrera",
      carreraId: carrera.carcve?.toString() || "N/A",
      ubicacion: estudiante.aluciu || "Tijuana", // O el valor que corresponda
      fotoUrl: estudiante.alufac || "",
      
      // Enviamos las inscripciones para lógica de historial si es necesario
      inscripciones: estudiante.inscripciones,
    };


    return NextResponse.json({
      message: `Bienvenido, ${studentAuth.nombreCompleto}`,
      nombre: studentAuth.nombreCompleto,
      estudiante: perfilCompleto,
    });
    

  } catch (error) {
    console.error(" Error en login route:", error);
    return NextResponse.json(
      { message: "Error en el servidor", error: error.message },
      { status: 500 }
    );
  }
}