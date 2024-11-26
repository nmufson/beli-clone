import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

async function main() {
  await prisma.user.deleteMany({});
  console.log(`Existing data deleted!`);

  const usersData = [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Avid book reader and writer.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'jane.smith@example.com',
      password: 'securePass456',
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Lover of historical fiction and fantasy novels.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'alice.wonder@example.com',
      password: 'aliceIn123',
      firstName: 'Alice',
      lastName: 'Wonder',
      bio: 'Exploring the magic of storytelling.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'mark.reader@example.com',
      password: 'readmore789',
      firstName: 'Mark',
      lastName: 'Reader',
      bio: 'Fiction enthusiast and aspiring novelist.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'lily.wordsworth@example.com',
      password: 'wordsmith456',
      firstName: 'Lily',
      lastName: 'Wordsworth',
      bio: 'Crafting words and diving into adventures.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
  ];

  const hashedUsersData = await Promise.all(
    usersData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword,
      };
    }),
  );

  await prisma.user.createMany({
    data: hashedUsersData,
    skipDuplicates: true,
  });
  console.log(`Users created!`);

  const allUsers = await prisma.user.findMany();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
