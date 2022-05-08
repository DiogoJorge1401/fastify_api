import { FastifyReply, FastifyRequest } from 'fastify'
import { createUser, findUsers, logInUser } from '@/useCases/user'
import { RegisterUserInput, LogInUserInput } from '@/schemas/user'

export class UserController {
  async registerUserHandler(
    req: FastifyRequest<{ Body: RegisterUserInput }>,
    rep: FastifyReply
  ) {
    const { email, name, password } = req.body

    const user = await createUser({ email, password, name })

    return rep.status(201).send(user)
  }

  async logInUserHandler(
    req: FastifyRequest<{ Body: LogInUserInput }>,
    rep: FastifyReply
  ) {
    const data = req.body
    const result = await logInUser(data)
    return rep.status(200).send(result)
  }

  async getUsersHandler(_, rep: FastifyReply) {
    const users = await findUsers()
    return rep.status(200).send({ users })
  }
}
