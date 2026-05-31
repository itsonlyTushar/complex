import "dotenv/config";
import { prisma } from '../src/config/db.js';

async function main() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        isClosed: true,
      }
    });
    console.log('--- Database Verification ---');
    console.log(`Found ${restaurants.length} restaurants:`);
    console.dir(restaurants, { depth: null });
    console.log('-----------------------------');
  } catch (error) {
    console.error('Verification Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
