// seed-admin.js — corre UNA SOLA VEZ: node seed-admin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = "NodalTec";
  const password = "eventosadmin2025";
  const email = "al20760204@ite.edu.mx";

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.adminCredentials.upsert({
    where: { username },
    update: { password: hashedPassword, email },
    create: { username, password: hashedPassword, email },
  });

  console.log("✅ Admin creado/actualizado:");
  console.log("   Usuario :", admin.username);
  console.log("   Email   :", admin.email);
  console.log("\n🔐 Credenciales:");
  console.log("   Usuario   : NodalTec");
  console.log("   Contraseña: eventosadmin2025");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
