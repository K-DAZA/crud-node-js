import { sendJSON } from '../helpers/sendJSON.js'
import { authorizationMiddleware } from '../middlewares/authorization.js'
import { createUser, getAllUsers, getUser } from '../models/user.js'
import { parserBody } from '../utils/parserBody.js'

export const userRouter = async (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = myUrl
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 1 && req.method === 'GET') {
    const users = getAllUsers()
    return sendJSON(res, 200, users)
  }

  if (segments.length === 2 && req.method === 'GET') {
    const userId = segments[1]
    const user = getUser(userId)
    if (user) return sendJSON(res, 200, user)
    else return sendJSON(res, 404, { message: 'User not found' })
  }

  if (segments.length === 1 && req.method === 'POST') {
    if (!authorizationMiddleware(['admin'])(req, res)) return

    const body = await parserBody(req)
    const { name, email } = body

    if (!name) {
      return sendJSON(res, 400, { message: 'Name is required' })
    }

    if (!email) {
      return sendJSON(res, 400, { message: 'Email is required' })
    }

    const newUser = { name, email }
    createUser(newUser)
    return sendJSON(res, 201, { message: 'User created successfully', user: newUser })
  }

  return sendJSON(res, 404, { message: 'User not found' })
}
