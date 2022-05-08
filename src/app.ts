import fastifyJwt from '@fastify/jwt'
import swagger, { SwaggerOptions } from '@fastify/swagger'
import Fastify, { FastifyInstance } from 'fastify'
import { withRefResolver } from 'fastify-zod'
import { RequestError } from './errors/RequestError'
import { authenticate } from './middlewares/authenticate'
import { productRoutes, userRoutes } from './routes/'
import { productSchemas } from './schemas/product'
import { userSchemas } from './schemas/user'
import { version } from '../package.json'

declare module 'fastify' {
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

class App {
  app: FastifyInstance

  constructor() {
    this.app = Fastify({ logger: true })
    this.configure()
  }

  private configure() {
    this.app.setErrorHandler((err, _, rep) => {
      if (err instanceof RequestError)
        rep.status(err.status).send({ error: err.message })
      else rep.status(500).send({ error: err.message })
    })

    this.decorators()
    this.schemas()
    this.plugins()
  }

  private plugins() {
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
    this.app.register(swagger, withRefResolver(optionSwagger))
    this.app.register(fastifyJwt, {
      secret: '406fb958db91cd22b7882812e9ff04e2',
    })
    this.app.register(userRoutes, { prefix: '/api/users' })
    this.app.register(productRoutes, { prefix: '/api/products' })
  }

  private decorators() {
    this.app.decorate('authenticate', authenticate)
  }

  private schemas() {
    for (const schema of userSchemas) this.app.addSchema(schema)
    for (const schema of productSchemas) this.app.addSchema(schema)
  }
}

export const { app } = new App()
