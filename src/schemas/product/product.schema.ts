import { buildJsonSchemas } from 'fastify-zod'
import { object, z } from 'zod'

const ProductInputSchema = {
  title: z.string(),
  content: z.string().optional(),
  price: z.number(),
}

const CreateProductSchema = z.object({
  ...ProductInputSchema,
})

const ProductResponseSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ...ProductInputSchema,
})

const GetProductsResponseSchema = z.array(
  z.object({
    id: z.number(),
    ...ProductInputSchema,
    owner: z.object({
      id: z.number(),
      name: z.string(),
    }),
  })
)

export type CreateProductInput = z.infer<typeof CreateProductSchema>

export const { $ref, schemas: productSchemas } = buildJsonSchemas({
  CreateProductSchema,
  ProductResponseSchema,
  GetProductsResponseSchema,
})
