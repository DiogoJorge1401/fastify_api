import { RegisterUserInput } from '@/schemas/user'
import { prisma } from '@/utils/prisma'
import { hashPassword } from '@/utils/hash'
import { RequestError } from '@/errors/RequestError'

export const createUser = async (data: RegisterUserInput) => {
  const { password, email, name } = data

  const userAlreadyExist = await prisma.user.findFirst({ where: { email } })

  if (userAlreadyExist) throw new RequestError('Email already used', 400)

  const { hash, salt } = hashPassword(password)

  return await prisma.user.create({
    data: {
      email,
      name,
      password: hash,
      salt,
    },
  })
}
