import { pbkdf2Sync, randomBytes } from 'crypto'

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

export const verifyPassword = ({
  candidatePassword,
  hashedPassword,
  salt,
}: {
  candidatePassword: string
  hashedPassword: string
  salt: string
}) => {
  const candidateHash = pbkdf2Sync(
    candidatePassword,
    salt,
    1000,
    64,
    'sha512'
  ).toString('hex')

  return candidateHash === hashedPassword
}
