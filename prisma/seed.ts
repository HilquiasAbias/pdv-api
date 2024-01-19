import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createRoles() {
  const roles = ['manager', 'employee'];

  for (const role of roles) {
    await prisma.role.create({
      data: {
        name: role,
      },
    });
  }
}

async function main() {
  await createRoles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
