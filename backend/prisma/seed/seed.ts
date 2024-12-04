import { PrismaClient, UserReaction, BookStatus } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

async function main() {
  await prisma.user.deleteMany({});
  await prisma.userFollower.deleteMany({});
  await prisma.followRequest.deleteMany({});
  await prisma.userBook.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});

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
    {
      email: 'oliver.page@example.com',
      password: 'turnthepage123',
      firstName: 'Oliver',
      lastName: 'Page',
      bio: 'Page by page, exploring new worlds.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'emma.author@example.com',
      password: 'writingrocks321',
      firstName: 'Emma',
      lastName: 'Author',
      bio: 'Writer, thinker, and bookworm.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'liam.reader@example.com',
      password: 'storytime456',
      firstName: 'Liam',
      lastName: 'Reader',
      bio: 'Exploring stories that shape lives.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'sophia.writera@example.com',
      password: 'creative123',
      firstName: 'Sophia',
      lastName: 'Writera',
      bio: 'Words and imagination fuel my world.',
      profilePictureUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DSW54utMSZ6J1F9luVr6YYDoRZ-FQYCL3w&s',
    },
    {
      email: 'noah.scribe@example.com',
      password: 'scribe789',
      firstName: 'Noah',
      lastName: 'Scribe',
      bio: 'Writing tales of mystery and wonder.',
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

  const userFollowerPairs = [
    {
      userId: allUsers[0].id,
      followerId: allUsers[1].id,
    },
    {
      userId: allUsers[1].id,
      followerId: allUsers[2].id,
    },
    {
      userId: allUsers[2].id,
      followerId: allUsers[3].id,
    },
    {
      userId: allUsers[3].id,
      followerId: allUsers[0].id,
    },
    {
      userId: allUsers[4].id,
      followerId: allUsers[1].id,
    },
  ];

  await prisma.userFollower.createMany({
    data: userFollowerPairs,
    skipDuplicates: true,
  });
  console.log(`User followers created!`);

  const followRequestPairs = [
    {
      senderId: allUsers[5].id,
      receiverId: allUsers[2].id,
    },
    {
      senderId: allUsers[4].id,
      receiverId: allUsers[3].id,
    },
    {
      senderId: allUsers[2].id,
      receiverId: allUsers[0].id,
    },
  ];

  await prisma.followRequest.createMany({
    data: followRequestPairs,
    skipDuplicates: true,
  });
  console.log(`Follow requests created!`);

  const userBooksData = [
    {
      userId: allUsers[0].id,
      googleBooksId: 'RyJtJZPX8jwC',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      imageUrl:
        'http://books.google.com/books/content?id=RyJtJZPX8jwC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70LBoudYDLeNer1aDyMqdIZcBbRVuIzwFOBIBSOJWxQFZ38M2B2MsgJafe1BWATGxBT1Q3_qrJ8O3GGYzrmBam9RXQ64unBjjBB047ODUNAAX1AwxX9gT1hoe8wsbqa4WEu1tt9&source=gbs_api',
      userReaction: UserReaction.LIKED,
      order: 1,
      status: BookStatus.FINISHED,
      userNote: 'A timeless classic about justice and morality.',
      hasPost: true,
    },
    {
      userId: allUsers[1].id,
      googleBooksId: 'PpcZEAAAQBAJ',
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      imageUrl:
        'http://books.google.com/books/publisher/content?id=PpcZEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72owpX5l32yFtkM4jEkBBOFnKpiEoJmMt6NUgX1b_TfPON5x7YtiYt5MrTw124o8xmabM_ARJ7fxOD8d1t-CabcR7DZECJTaJ0Ay85vm3JvbBYmrpyDIqq-oLi0Wk_Xf4qHDRnr&source=gbs_api',
      userReaction: UserReaction.LIKED,
      order: 1,
      status: BookStatus.FINISHED,
      userNote: 'Chilling and thought-provoking.',
      hasPost: true,
    },
    {
      userId: allUsers[2].id,
      googleBooksId: 'EvqJCGeqKhsC',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      imageUrl:
        'http://books.google.com/books/content?id=EvqJCGeqKhsC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72wJ62CDJC5RXtnVwG_bcg2Fl0qnwEkK-OOEz_z3j14RahPm5JhyFI8R6BPmHJtzYV56TX2m-Yu9stTGED0NBRoNRP2PjbGljowAPuqTcHQ8bIsmvuRed4o1ZWe_aN6PQkq0tGq&source=gbs_api',
      userReaction: UserReaction.OKAY,
      order: 1,
      status: BookStatus.FINISHED,
      userNote: 'A classic romantic tale.',
      hasPost: true,
    },
    {
      userId: allUsers[3].id,
      googleBooksId: 'xmnuDwAAQBAJ',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Fiction',
      imageUrl: 'https://m.media-amazon.com/images/I/81QuEGw8VPL.jpg',
      userReaction: UserReaction.DISLIKED,
      order: 1,
      status: BookStatus.FINISHED,
      hasPost: true,
    },
    {
      userId: allUsers[4].id,
      googleBooksId: 'FmyBAwAAQBAJ',
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      genre: 'Non-Fiction',
      imageUrl:
        'http://books.google.com/books/publisher/content?id=FmyBAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70ccqOyLu1uornkTSVdQhwIoL2f_K08B-kTWl2ZMqcgAk7fY8XwtEz5E6YtwbnpIWLE8rBymQZhdnTePO4aDpCd-RbL0oSJ6h9wDVl_ywm23tEWdq64kzQz-MfUlfE66ZibuqQd&source=gbs_api',
      status: BookStatus.CURRENTLY_READING,
      hasPost: true,
    },
    {
      userId: allUsers[5].id,
      googleBooksId: '5AoREQAAQBAJ',
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Fiction',
      imageUrl:
        'http://books.google.com/books/publisher/content?id=5AoREQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73zk0JBoQp4XnMNXF9mnKVA3Fn74Vglg0fgB_Ky3yBmvYC3yCqo5ZR-rZM1aMM3TXsN0iV5md7YRm1JEaKFBIJu3Fym2pqNFHOAHukt6tsWb5vlPJUOPLj143O1SLmZNnHh1_e&source=gbs_api',
      status: BookStatus.WANT_TO_READ,
      hasPost: true,
    },
    {
      userId: allUsers[6].id,
      googleBooksId: 'lz-BoS0zjIgC',
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      imageUrl:
        'http://books.google.com/books/content?id=lz-BoS0zjIgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      userReaction: UserReaction.LIKED,
      order: 1,
      status: BookStatus.FINISHED,
      hasPost: true,
    },
    {
      userId: allUsers[7].id,
      googleBooksId: 'V-8kEAAAQBAJ',
      title: 'Becoming',
      author: 'Michelle Obama',
      genre: 'Biography',
      imageUrl:
        'http://books.google.com/books/content?id=V-8kEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      status: BookStatus.CURRENTLY_READING,
      hasPost: true,
    },
    {
      userId: allUsers[8].id,
      googleBooksId: 'SHvzzuCnuv8C',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      genre: 'Psychology',
      imageUrl:
        'http://books.google.com/books/content?id=SHvzzuCnuv8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      userReaction: UserReaction.LIKED,
      order: 1,
      status: BookStatus.FINISHED,
      hasPost: true,
    },
    {
      userId: allUsers[9].id,
      googleBooksId: '2ObWDgAAQBAJ',
      title: 'Educated',
      author: 'Tara Westover',
      genre: 'Biography',
      imageUrl:
        'http://books.google.com/books/content?id=2ObWDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
      status: BookStatus.DID_NOT_FINISH,
      hasPost: true,
    },
  ];

  await prisma.userBook.createMany({
    data: userBooksData,
    skipDuplicates: true,
  });

  console.log('UserBooks created!');

  const allUserBooks = await prisma.userBook.findMany();

  const commentsData = [
    {
      userBookId: allUserBooks[0].id,
      userId: allUsers[0].id,
      content: 'nice post!!',
    },
    {
      userBookId: allUserBooks[0].id,
      userId: allUsers[1].id,
      content: 'will have to give this one another read',
    },
    {
      userBookId: allUserBooks[0].id,
      userId: allUsers[2].id,
      content: 'nice post!!',
    },
  ];

  await prisma.comment.createMany({
    data: commentsData,
  });

  console.log('Comments created!');

  const allComments = await prisma.comment.findMany();

  const likesData = [
    {
      userBookId: allUserBooks[0].id,
      commentId: undefined,
      userId: allUsers[0].id,
    },
    {
      userBookId: allUserBooks[0].id,
      commentId: undefined,
      userId: allUsers[1].id,
    },
    {
      userBookId: allUserBooks[0].id,
      commentId: undefined,
      userId: allUsers[2].id,
    },
    {
      userBookId: undefined,
      commentId: allComments[0].id,
      userId: allUsers[1].id,
    },
    {
      userBookId: undefined,
      commentId: allComments[0].id,
      userId: allUsers[2].id,
    },
  ];

  await prisma.like.createMany({
    data: likesData,
  });

  console.log('Likes created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
