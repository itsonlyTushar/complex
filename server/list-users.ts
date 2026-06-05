import "dotenv/config";
import { prisma } from "./src/config/db.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Current Users in DB:", users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
