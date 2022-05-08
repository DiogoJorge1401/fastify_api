import { FastifyInstance } from 'fastify'
import { UserController } from '@/controllers/user.controller'
import { $ref } from '@/schemas/user'

export const userRoutes = async (app: FastifyInstance) => {
  const userController = new UserController()

  app.post(
    '/',
    {
      schema: {
        body: $ref('RegisterUserSchema'),
        response: { 201: $ref('RegisterUserResponseSchema') },
      },
    },
    userController.registerUserHandler
  )

  app.post(
    '/login',
    {
      schema: {
        body: $ref('LogInUserSchema'),
        response: {
          200: $ref('LogInResponseSchema'),
        },
      },
    },
    userController.logInUserHandler
  )

  app.get(
    '/',
    { preHandler: [app.authenticate] },
    userController.getUsersHandler
  )
}
