import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Crear usuario de prueba con credenciales
  const hashedPassword = await hash("password123", 10);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Usuario de Prueba",
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Usuario de prueba creado:", testUser.email);
  console.log("   Email: test@example.com");
  console.log("   Password: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
