import { verifyPassword } from '../helpers/hashPassword.js'
import { sendJSON } from '../helpers/sendJSON.js'
import { authMiddleware } from '../middlewares/authentication.js'
import { addRevokedToken, createAuthUser, getAuthUser, isTokenRevoked } from '../models/auth.js'
import { parserBody } from '../utils/parserBody.js'
import crypto from 'node:crypto'

export const authRouter = async (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = myUrl

  if (pathname === '/auth/register' && req.method === 'POST') {
    const body = await parserBody(req)
    const { email, password, role } = body

    if (getAuthUser(email)) {
      return sendJSON(res, 400, { message: 'Email already exists' })
    }

    try {
      const user = createAuthUser(email, password, role)
      return sendJSON(res, 201, { message: 'User registered successfully', user })
    } catch (error) {
      return sendJSON(res, 500, { message: 'Internal Server Error' })
    }
  }

  if (pathname === '/auth/login' && req.method === 'POST') {
    const body = await parserBody(req)
    const { email, password } = body

    if (!email || !password) {
      return sendJSON(res, 400, { message: 'Email and password are required' })
    }

    try {
      const user = getAuthUser(email)

      if (!user || !verifyPassword(password, user.password)) {
        return sendJSON(res, 401, { message: 'Invalid email or password' })
      }

      const token = `user_${user.id}_${crypto.randomUUID()}`
      return sendJSON(res, 200, { message: 'Login successful', token })
    } catch (error) {
      return sendJSON(res, 500, { message: 'Internal Server Error' })
    }
  }

  if (pathname === '/auth/logout' && req.method === 'POST') {
    if (!authMiddleware(req, res)) return

    const authHeader = req.headers.authorization
    if (!authHeader) {
      return sendJSON(res, 401, { message: 'Authorization header missing' })
    }

    const token = authHeader.split(' ')[1]
    if (isTokenRevoked(token)) {
      return sendJSON(res, 401, { message: 'Token has already been revoked' })
    }

    addRevokedToken(token)
    return sendJSON(res, 200, { message: 'Logout successful' })
  }
}
