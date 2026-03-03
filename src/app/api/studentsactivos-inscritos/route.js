import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    // Obtener todas las inscripciones con datos del estudiante y actividad
    const inscripciones = await prisma.inscripact.findMany({
      include: {
        estudiante: {
          select: {
            aluctr: true,
            alunom: true,
            aluapp: true,
            aluapm: true,
            alumai: true
          }
        },
        actividad: {
          select: {
            id: true,
            aconco: true,
            aticve: true
          }
        }
      },
      orderBy: {
        fechaInscripcion: 'desc'
      }
    });

    // Agrupar por estudiante
    const estudiantesMap = new Map();
    
    inscripciones.forEach(inscripcion => {
      const estudianteId = inscripcion.estudiante.aluctr;
      
      if (!estudiantesMap.has(estudianteId)) {
        estudiantesMap.set(estudianteId, {
          aluctr: inscripcion.estudiante.aluctr,
          alunom: inscripcion.estudiante.alunom,
          aluapp: inscripcion.estudiante.aluapp,
          aluapm: inscripcion.estudiante.aluapm,
          alumai: inscripcion.estudiante.alumai,
          inscripciones: []
        });
      }
      
      estudiantesMap.get(estudianteId).inscripciones.push({
        id: inscripcion.id,
        actividadId: inscripcion.actividadId,
        fechaInscripcion: inscripcion.fechaInscripcion,
        formularioData: inscripcion.formularioData,
        actividad: {
          id: inscripcion.actividad.id,
          actnom: inscripcion.actividad.aconco || inscripcion.actividad.aticve
        }
      });
    });

    // Convertir Map a Array y ordenar por nombre
    const estudiantesInscritos = Array.from(estudiantesMap.values()).sort((a, b) => 
      a.alunom.localeCompare(b.alunom)
    );

    return Response.json(estudiantesInscritos);
  } catch (error) {
    console.error('Error al obtener estudiantes inscritos:', error);
    return Response.json(
      { 
        error: 'Error al obtener estudiantes inscritos',
        details: error.message 
      },
      { status: 500 }
    );
  }
}