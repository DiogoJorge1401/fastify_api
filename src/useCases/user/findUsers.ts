import { prisma } from '@/utils/prisma'

export const findUsers = () =>
  prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  })
