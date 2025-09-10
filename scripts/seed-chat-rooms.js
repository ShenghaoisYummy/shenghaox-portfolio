const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedChatRooms() {
  try {
    // Create default chat rooms
    const rooms = [
      {
        name: 'General',
        description: 'General discussion for everyone'
      },
      {
        name: 'Tech Talk',
        description: 'Discuss technology, programming, and development'
      },
      {
        name: 'Random',
        description: 'Random conversations and off-topic discussions'
      }
    ];

    for (const room of rooms) {
      const existingRoom = await prisma.chatRoom.findFirst({
        where: { name: room.name }
      });

      if (!existingRoom) {
        await prisma.chatRoom.create({
          data: room
        });
        console.log(`Created chat room: ${room.name}`);
      } else {
        console.log(`Chat room already exists: ${room.name}`);
      }
    }

    console.log('Chat rooms seeded successfully!');
  } catch (error) {
    console.error('Error seeding chat rooms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChatRooms();