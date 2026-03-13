import { prisma } from '@/lib/prisma';

export async function DELETE(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);

    const actividad = await prisma.actividades.findUnique({
      where: { id },
      include: {
        inscripact: true,
        ofertas: true,
        constancias: true,
      },
    });

    if (!actividad) {
      return Response.json({ error: 'Actividad no encontrada' }, { status: 404 });
    }

    if (actividad.inscripact.length > 0) {
      return Response.json(
        { message: `No se puede eliminar: tiene ${actividad.inscripact.length} inscripción(es) activa(s)` },
        { status: 400 }
      );
    }

    if (actividad.ofertas.length > 0) {
      return Response.json(
        { message: `No se puede eliminar: está en ${actividad.ofertas.length} oferta(s) publicada(s)` },
        { status: 400 }
      );
    }

    await prisma.actividades.delete({ where: { id } });

    return Response.json({ message: 'Actividad eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    return Response.json({ error: 'Error al eliminar actividad' }, { status: 500 });
  }
}