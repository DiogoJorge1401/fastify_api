import { LogInUserInput } from '@/schemas/user'
import { verifyPassword } from '@/utils/hash'
import { prisma } from '@/utils/prisma'
import { RequestError } from '@/errors/RequestError'
import { app } from '@/app'

export const logInUser = async (data: LogInUserInput) => {
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

  const accessToken = app.jwt.sign(rest, {
    expiresIn: '30m',
  })

  return { accessToken }
}
