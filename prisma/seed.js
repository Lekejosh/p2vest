const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Define the admin details
  const adminData = {
    username: "admin",
    email: "admin@example.com",
    password: "securepassword123",
    role: "ADMIN",
  };

  // Check if the admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
  } else {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create the admin user
    await prisma.user.create({
      data: {
        username: adminData.username,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
      },
    });

    console.log("Admin user created successfully.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
