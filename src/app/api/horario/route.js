// ============================================
// Para tu ruta: src/app/api/horario/route.js
// ============================================

import { prisma } from '@/lib/prisma';

export async function PUT(request) {
  try {
    const { id, horario } = await request.json();

    console.log('Guardando horario para actividad:', id);
    console.log('Datos del horario:', horario);

    // Validar datos
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Falta el ID de la actividad' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!horario || !horario.dias || !horario.horaInicio || !horario.horaFin) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos del horario' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Actualizar actividad
    const actividadActualizada = await prisma.actividades.update({
      where: { id: parseInt(id) },
      data: { horario: horario }
    });

    console.log('Horario guardado exitosamente');

    return new Response(
      JSON.stringify(actividadActualizada),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al guardar horario:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error al guardar horario' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}