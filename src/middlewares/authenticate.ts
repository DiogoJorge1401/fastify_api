import { FastifyRequest } from 'fastify'
import { RequestError } from '@/errors/RequestError'

export const authenticate = async (req: FastifyRequest) => {
  try {
    await req.jwtVerify()
  } catch (err) {
    throw new RequestError(err.message, 401)
  }
}
