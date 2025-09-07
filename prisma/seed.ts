import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建初始的反应类型
  const reactionTypes = ['like', 'cheer', 'celebrate', 'appreciate', 'smile']
  
  for (const type of reactionTypes) {
    await prisma.reaction.upsert({
      where: { type },
      update: {},
      create: {
        type,
        count: 0,
      },
    })
  }
  
  console.log('Database seeded with reaction types')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })