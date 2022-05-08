import { CreateProductInput } from '@/schemas/product'
import { createProduct, getProducts } from '@/useCases/product'
import { FastifyReply, FastifyRequest } from 'fastify'

export class ProductController {
  async registerProductHandler(
    req: FastifyRequest<{ Body: CreateProductInput }>,
    rep: FastifyReply
  ) {
    const ownerId = req.user.id

    const product = await createProduct({ ownerId, ...req.body })

    return rep.status(201).send(product)
  }

  async getProductsHandler(_, rep: FastifyReply) {
    const products = await getProducts()
    return rep.status(200).send(products)
  }
}
