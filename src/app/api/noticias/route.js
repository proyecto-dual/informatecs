// app/api/noticias/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Archivo JSON para guardar las noticias
const noticiasFilePath = path.join(process.cwd(), "data", "noticias.json");

// Asegurar que existe el directorio
const ensureDataDirectory = () => {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      console.log("Creando directorio data...");
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(noticiasFilePath)) {
      console.log("Creando archivo noticias.json...");
      fs.writeFileSync(
        noticiasFilePath,
        JSON.stringify({ noticias: [], eventos: [] }, null, 2)
      );
    }
    return true;
  } catch (error) {
    console.error("Error creando directorio:", error);
    return false;
  }
};

// GET - Obtener todas las noticias
export async function GET() {
  try {
    console.log("GET request recibida");
    ensureDataDirectory();

    if (!fs.existsSync(noticiasFilePath)) {
      console.log("Archivo no existe, retornando datos vacíos");
      return NextResponse.json({ noticias: [], eventos: [] });
    }

    const data = fs.readFileSync(noticiasFilePath, "utf8");
    const jsonData = JSON.parse(data);
    console.log("Datos cargados:", jsonData);
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({
      noticias: [],
      eventos: [],
      error: error.message,
    });
  }
}

// POST - Guardar noticia o evento
export async function POST(request) {
  try {
    console.log("POST request recibida");

    if (!ensureDataDirectory()) {
      return NextResponse.json(
        { success: false, error: "No se pudo crear el directorio" },
        { status: 500 }
      );
    }

    const newItem = await request.json();
    console.log("Datos recibidos:", newItem);

    let jsonData = { noticias: [], eventos: [] };

    // Leer datos existentes
    if (fs.existsSync(noticiasFilePath)) {
      const data = fs.readFileSync(noticiasFilePath, "utf8");
      jsonData = JSON.parse(data);
    }

    if (newItem.type === "noticia") {
      const nuevaNoticia = {
        id: Date.now().toString(),
        titulo: newItem.titulo,
        descripcion: newItem.descripcion,
        fecha: newItem.fecha,
        imagen: newItem.imagen || "",
        createdAt: new Date().toISOString(),
      };
      console.log("Agregando noticia:", nuevaNoticia);
      jsonData.noticias.push(nuevaNoticia);
    } else if (newItem.type === "evento") {
      const nuevoEvento = {
        id: Date.now().toString(),
        titulo: newItem.titulo,
        descripcion: newItem.descripcion,
        fecha: newItem.fecha,
        ubicacion: newItem.ubicacion,
        imagen: newItem.imagen || "",
        createdAt: new Date().toISOString(),
      };
      console.log("Agregando evento:", nuevoEvento);
      jsonData.eventos.push(nuevoEvento);
    }

    fs.writeFileSync(noticiasFilePath, JSON.stringify(jsonData, null, 2));
    console.log("Datos guardados exitosamente");

    return NextResponse.json({ success: true, data: jsonData });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar noticia o evento
export async function DELETE(request) {
  try {
    console.log("DELETE request recibida");
    ensureDataDirectory();
    const { id, type } = await request.json();
    console.log("Eliminando:", { id, type });

    const data = fs.readFileSync(noticiasFilePath, "utf8");
    const jsonData = JSON.parse(data);

    if (type === "noticia") {
      jsonData.noticias = jsonData.noticias.filter((n) => n.id !== id);
    } else if (type === "evento") {
      jsonData.eventos = jsonData.eventos.filter((e) => e.id !== id);
    }

    fs.writeFileSync(noticiasFilePath, JSON.stringify(jsonData, null, 2));
    console.log("Eliminado exitosamente");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar noticia o evento
export async function PUT(request) {
  try {
    console.log("PUT request recibida");
    ensureDataDirectory();
    const updatedItem = await request.json();
    console.log("Actualizando:", updatedItem);

    const data = fs.readFileSync(noticiasFilePath, "utf8");
    const jsonData = JSON.parse(data);

    if (updatedItem.type === "noticia") {
      const index = jsonData.noticias.findIndex((n) => n.id === updatedItem.id);
      if (index !== -1) {
        jsonData.noticias[index] = {
          ...jsonData.noticias[index],
          titulo: updatedItem.titulo,
          descripcion: updatedItem.descripcion,
          fecha: updatedItem.fecha,
          imagen: updatedItem.imagen || jsonData.noticias[index].imagen,
        };
      }
    } else if (updatedItem.type === "evento") {
      const index = jsonData.eventos.findIndex((e) => e.id === updatedItem.id);
      if (index !== -1) {
        jsonData.eventos[index] = {
          ...jsonData.eventos[index],
          titulo: updatedItem.titulo,
          descripcion: updatedItem.descripcion,
          fecha: updatedItem.fecha,
          ubicacion: updatedItem.ubicacion,
          imagen: updatedItem.imagen || jsonData.eventos[index].imagen,
        };
      }
    }

    fs.writeFileSync(noticiasFilePath, JSON.stringify(jsonData, null, 2));
    console.log("Actualizado exitosamente");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en PUT:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
