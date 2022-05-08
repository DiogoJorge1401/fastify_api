import { FastifyInstance } from 'fastify'
import { ProductController } from '../controllers/product.controller'
import { $ref } from '../schemas/product'

export const productRoutes = async (app: FastifyInstance) => {
  const productController = new ProductController()

  app.post(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        body: $ref('CreateProductSchema'),
        response: { 201: $ref('ProductResponseSchema') },
      },
    },
    productController.registerProductHandler
  )

  app.get(
    '/',
    { schema: { response: { 200: $ref('GetProductsResponseSchema') } } },
    productController.getProductsHandler
  )
}
