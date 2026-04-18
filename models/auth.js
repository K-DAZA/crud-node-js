import { hashPassword } from '../helpers/hashPassword.js'

const authUsers = new Map()

export const createAuthUser = (email, password, role) => {
  const id = crypto.randomUUID()
  const hashedPassword = hashPassword(password)
  const user = { id, email, password: hashedPassword, role }
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

/**
 * Below code is related to revoke tokens, but since we are using in-memory storage, it will be lost when the server restarts.
 * In a real application, you would store revoked tokens in a database or cache.
 */
const revokedTokens = new Set()

export const addRevokedToken = (token) => {
  revokedTokens.add(token)
}

export const isTokenRevoked = (token) => {
  return revokedTokens.has(token)
}
