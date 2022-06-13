import { LogInUserInput } from '@/schemas/user'
import { verifyPassword } from '@/utils/hash'
import { prisma } from '@/utils/prisma'
import { RequestError } from '@/errors/RequestError'
import { JWT } from '@fastify/jwt'

export const logInUser = async (signJWT: JWT['sign'], data: LogInUserInput) => {
  const { password: candidatePassword, email } = data

  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) throw new RequestError("User doesn't exist", 401)

  const passwordsMatch = verifyPassword({
    candidatePassword,
    hashedPassword: user.password,
    salt: user.salt,
  })

  if (!passwordsMatch) throw new RequestError("User doesn't exist", 401)

  const { password, salt, ...rest } = user

  const accessToken = signJWT(rest, {
    expiresIn: '30m',
  })

  return { accessToken }
}
