import { buildServer } from '@/app'
import * as createUserModule from '@/useCases/user/createUser'
import faker from '@faker-js/faker'
import { test } from 'tap'
import { ImportMock } from 'ts-mock-imports'
import { prisma } from '@/utils/prisma'

test('POST `/api/users` - create an user successfully with mock createUser', async (t) => {
  const [name, email, password, id] = [
    faker.name.findName(),
    faker.internet.email(),
    faker.internet.password(),
    Math.floor(Math.random() * 1_000),
  ]
  
  const app = buildServer()

  const stub = ImportMock.mockFunction(createUserModule, 'createUser', {
    name,
    email,
    id,
  })

  t.teardown(() => {
    app.close()
    stub.restore()
  })

  const response = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      email,
      password,
      name,
    },
  })

  t.equal(response.statusCode, 201)
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8')

  const json = response.json()

  t.equal(json.name, name)
  t.equal(json.email, email)
  t.equal(json.id, id)
})

test('POST `/api/users` - create an user successfully with test database', async (t) => {
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

  const response = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      email,
      password,
      name,
    },
  })

  t.equal(response.statusCode, 201)
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8')

  const json = response.json()

  t.equal(json.name, name)
  t.equal(json.email, email)
  t.type(json.id, 'number')
})

test('POST `/api/users` - fail to create a user when fields are missing', async (t) => {
  const [name, password] = [faker.name.findName(), faker.internet.password()]
  const app = buildServer()

  t.teardown(async () => {
    app.close()
    await prisma.user.deleteMany()
  })

  const response = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      password,
      name,
    },
  })

  const json = response.json()
  t.equal(response.statusCode, 500)
  t.same(json, { error: "body should have required property 'email'" })
})

test('POST `/api/users` - fail to create when user already exist', async (t) => {
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
    payload: {
      email,
      password,
      name,
    },
  })

  const response = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      email,
      password,
      name,
    },
  })

  const json = response.json()

  t.same(json, { error: 'Email already used' })
  t.equal(response.statusCode, 400)
})
