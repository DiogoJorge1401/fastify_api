import { CreateProductInput } from '@/schemas/product'
import { prisma } from '@/utils/prisma'

export const createProduct = (
  data: CreateProductInput & { ownerId: number }
) => {
  return prisma.product.create({
    data: {
      price: data.price,
      ownerId: data.ownerId,
      title: data.title,
      content: data.content,
    },
  })
}
