import "dotenv/config";
import { prisma } from '../src/config/db.js';

async function main() {
  try {
    const foodCourts = await prisma.foodCourt.findMany();
    console.log('Food Courts:', foodCourts.length);

    const restaurants = await prisma.restaurant.findMany({
      where: { id: 23 }
    });
    console.log('Restaurant 23:', restaurants);

    const users = await prisma.user.findMany({
      where: { email: 'food@patel.com' }
    });
    console.log('User food@patel.com:', users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
