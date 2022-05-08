import { z } from 'zod'
import { buildJsonSchemas } from 'fastify-zod'

const UserCore = {
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  name: z.string(),
}

const RegisterUserSchema = z.object({
  ...UserCore,
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(4, {
      message: 'Password must be at least 4 characters',
    }),
})
const RegisterUserResponseSchema = z.object({
  id: z.number(),
  ...UserCore,
})

const LogInUserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }),
})
const LogInResponseSchema = z.object({
  accessToken: z.string(),
})

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
export type LogInUserInput = z.infer<typeof LogInUserSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  RegisterUserSchema,
  RegisterUserResponseSchema,
  LogInUserSchema,
  LogInResponseSchema,
})
