import { prisma } from '@/utils/prisma'

export const getProducts = () =>
  prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      content: true,
      owner: {
        select: { id: true, name: true },
      },
    },
  })
