const fs = require("fs");
const path = require("path");

// Carpeta base de tus páginas
const appDir = path.join(__dirname, "app");

function getRoutes(dir, route = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let routes = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Si contiene un page.tsx o page.jsx
      const pagePathTsx = path.join(dir, entry.name, "page.tsx");
      const pagePathJsx = path.join(dir, entry.name, "page.jsx");
      if (fs.existsSync(pagePathTsx) || fs.existsSync(pagePathJsx)) {
        const fullRoute = path.join(route, entry.name).replace(/\\/g, "/");
        routes.push("/" + fullRoute);
      }
      // Recurse a subcarpetas
      routes = routes.concat(
        getRoutes(path.join(dir, entry.name), path.join(route, entry.name))
      );
    }
  }

  return routes;
}

const allRoutes = getRoutes(appDir);
console.log("=== Rutas encontradas en /app ===");
allRoutes.forEach((r) => console.log(r));
