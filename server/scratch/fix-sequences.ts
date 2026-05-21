import "dotenv/config";
import { prisma } from "../src/config/db.js";

async function main() {
  console.log("Fixing database auto-increment sequences...");

  try {
    const tables = ["FoodCourt", "Restaurant", "User"];
    for (const table of tables) {
      console.log(`Syncing sequence for "${table}"...`);
      await prisma.$executeRawUnsafe(`
        SELECT setval(
          pg_get_serial_sequence('"${table}"', 'id'), 
          COALESCE((SELECT MAX(id) FROM "${table}"), 1), 
          (SELECT MAX(id) FROM "${table}") IS NOT NULL
        );
      `);
    }
    console.log("All database auto-increment sequences synchronized successfully!");
  } catch (error) {
    console.error("Error fixing sequences:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
