const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        employee: true
      }
    });
    console.log("Leaves found:", JSON.stringify(leaves, null, 2));
  } catch (err) {
    console.error("Error fetching leaves:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
