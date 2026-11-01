import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  console.log("Seeding Administrator account...");

  const existing = await db.adminUser.findUnique({
    where: { email: "admin@apin.dev" },
  });

  const passwordHash = await hashPassword("Admin@123456");

  if (existing) {
    await db.adminUser.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        isActive: true,
      },
    });
    console.log("Updated Admin account: admin@apin.dev / Admin@123456");
  } else {
    await db.adminUser.create({
      data: {
        email: "admin@apin.dev",
        passwordHash,
        name: "System Administrator",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    console.log("Created Admin account: admin@apin.dev / Admin@123456");
  }

  // Also ensure default system email config exists
  const emailConfig = await db.systemEmailConfig.findUnique({
    where: { id: "default" },
  });

  if (!emailConfig) {
    await db.systemEmailConfig.create({
      data: {
        id: "default",
        provider: "smtp",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        fromEmail: "apin.official@gmail.com",
        fromName: "APIN Verification",
        isActive: true,
      },
    });
    console.log("Initialized default system email config (ready for Gmail credentials).");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
