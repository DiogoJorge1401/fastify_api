import fastifyJwt, { JWT } from '@fastify/jwt'
import swagger, { SwaggerOptions } from '@fastify/swagger'
import Fastify from 'fastify'
import { withRefResolver } from 'fastify-zod'
import { version } from '../package.json'
import { RequestError } from './errors/RequestError'
import { authenticate } from './middlewares/authenticate'
import { productRoutes, userRoutes } from './routes/'
import { productSchemas } from './schemas/product'
import { userSchemas } from './schemas/user'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
  export interface FastifyInstance {
    authenticate: any
  }
}

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      email: string
      name: string
      id: number
    }
  }
}

const optionSwagger: SwaggerOptions = {
  routePrefix: '/docs',
  exposeRoute: true,
  staticCSP: true,
  openapi: {
    info: {
      title: 'Fastify API',
      description: 'API for some products',
      version,
    },
  },
}
export const buildServer = () => {
  const app = Fastify({ logger: { level: 'info', prettyPrint: true } })

  app.addHook('preHandler', (req, _, done) => {
    req.jwt = app.jwt
    done()
  })
  app.register(fastifyJwt, { secret: '406fb958db91cd22b7882812e9ff04e2' })

  app.register(swagger, withRefResolver(optionSwagger))

  app.register(userRoutes, { prefix: '/api/users' })

  app.register(productRoutes, { prefix: '/api/products' })

  app.decorate('authenticate', authenticate)

  for (const schema of userSchemas) app.addSchema(schema)

  for (const schema of productSchemas) app.addSchema(schema)

  const errorHandler = (err, _, rep) => {
    if (err instanceof RequestError)
      rep.status(err.status).send({ error: err.message })
    else rep.status(500).send({ error: err.message })
  }

  app.setErrorHandler(errorHandler)

  app.get('/healthcheck', async (req, rep) => rep.send('OK'))

  return app
}
