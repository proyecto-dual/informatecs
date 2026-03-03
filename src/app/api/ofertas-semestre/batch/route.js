import { prisma } from '@/lib/prisma';
export async function POST(request) {
  try {
    const { ofertas } = await request.json();
    
    if (!ofertas || !Array.isArray(ofertas)) {
      return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    console.log('Ofertas a crear:', ofertas);

    const resultado = await prisma.ofertaSemestre.createMany({
      data: ofertas,
      skipDuplicates: true
    });

    // Verificar qué se creó
    const ofertasCreadas = await prisma.ofertaSemestre.findMany({
      take: 10,
      orderBy: { id: 'desc' }
    });

    console.log('Ofertas creadas:', ofertasCreadas);

    return Response.json({
      message: 'Actividades publicadas exitosamente',
      count: resultado.count,
      ultimasOfertas: ofertasCreadas
    });
  } catch (error) {
    console.error('Error completo:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Agregar GET para consultar ofertas
export async function GET(request) {
  try {
    const ofertas = await prisma.ofertaSemestre.findMany({
      include: {
        actividad: true
      }
    });
    
    return Response.json(ofertas);
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
// Eliminar una oferta individual: DELETE /api/ofertas-semestre/batch?id=5
// Eliminar todas:                  DELETE /api/ofertas-semestre/batch  (sin query param)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Eliminar individual
      const ofertaId = parseInt(id);
      if (isNaN(ofertaId)) {
        return Response.json({ error: 'ID inválido' }, { status: 400 });
      }

      await prisma.ofertaSemestre.delete({
        where: { id: ofertaId },
      });

      return Response.json({ message: 'Oferta eliminada correctamente' });
    } else {
      // Reiniciar: eliminar todas
      const resultado = await prisma.ofertaSemestre.deleteMany({});

      return Response.json({
        message: 'Todas las ofertas eliminadas',
        count: resultado.count,
      });
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
