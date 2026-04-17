import { hashPassword } from '../helpers/hashPassword.js'

const authUsers = new Map()

export const createAuthUser = (email, password) => {
  const id = crypto.randomUUID()
  const hashedPassword = hashPassword(password)

  const user = { id, email, password: hashedPassword }
  authUsers.set(email, user)
  return user
}

export const getAuthUser = (email) => {
  return authUsers.get(email)
}

export const getAuthUserById = (id) => {
  for (const user of authUsers.values()) {
    if (user.id === id) return user
  }
  return null
}
