import "dotenv/config";
import { prisma } from '../src/config/db.js';
import { userService, uploadLogo } from '../src/services/user.service.js';

async function main() {
  try {
    // 1. Get first user in DB
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      console.log('No user found to test with.');
      return;
    }
    console.log('Original User:', firstUser);

    // 2. Test uploadLogo service
    console.log('Testing uploadLogo service...');
    const updatedLogoUser = await uploadLogo(firstUser.id, 'https://example.com/logo.png');
    console.log('Updated Logo User (uploadLogo return):', updatedLogoUser);

    // 3. Test updating restaurantDescription directly
    console.log('Testing restaurantDescription update...');
    const updatedDescUser = await prisma.user.update({
      where: { id: firstUser.id },
      data: {
        restaurantDescription: 'A premium restaurant offering local culinary delights!'
      }
    });
    console.log('Updated Description User:', updatedDescUser);

    // 4. Test userService to see if logo and restaurantDescription are successfully selected and returned
    console.log('Testing userService select...');
    const fetchedUser = await userService(firstUser.id);
    console.log('Fetched User (userService):', fetchedUser);

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
