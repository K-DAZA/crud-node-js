import { verifyPassword } from '../helpers/hashPassword.js'
import { sendJSON } from '../helpers/sendJSON.js'
import { createAuthUser, getAuthUser } from '../models/auth.js'
import { parserBody } from '../utils/parserBody.js'

export const authRouter = async (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = myUrl

  if (pathname === '/auth/register' && req.method === 'POST') {
    const body = await parserBody(req)
    const { email, password } = body

    if (getAuthUser(email)) {
      return sendJSON(res, 400, { message: 'Email already exists' })
    }

    try {
      const user = createAuthUser(email, password)
      return sendJSON(res, 201, { message: 'User registered successfully', user })
    } catch (error) {
      return sendJSON(res, 500, { message: 'Internal Server Error' })
    }
  }

  if (pathname === '/auth/login' && req.method === 'POST') {
    const body = await parserBody(req)
    const { email, password } = body

    try {
      const user = getAuthUser(email)

      if (!user || !verifyPassword(password, user.password)) {
        return sendJSON(res, 401, { message: 'Invalid email or password' })
      }

      const token = `user_${user.id}`
      req.user = user
      return sendJSON(res, 200, { message: 'Login successful', token })
    } catch (error) {
      return sendJSON(res, 404, { message: 'Not Found' })
    }
  }
}
