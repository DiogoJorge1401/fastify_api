import faker from '@faker-js/faker'
import { test } from 'tap'
import { buildServer } from '../app'
import { prisma } from '@/utils/prisma'
import { UserType } from '@fastify/jwt'

test('POST `/api/users/login`', async () => {
  test('given that the email and password are correct', async (t) => {
    const [name, email, password] = [
      faker.name.findName(),
      faker.internet.email(),
      faker.internet.password(),
    ]

    const app = buildServer()

    t.teardown(async () => {
      app.close()
      await prisma.user.deleteMany()
    })

    await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: { email, password, name },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: { email, password },
    })

    t.equal(response.statusCode, 200)

    const verified = app.jwt.verify<UserType>(response.json().accessToken)

    t.equal(verified.email, email)
  })
  test("given that the email and password aren't correct", async (t) => {})
})
