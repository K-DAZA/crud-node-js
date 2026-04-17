import { sendJSON } from '../helpers/sendJSON.js'
import { getAuthUserById } from '../models/auth.js'

export const authMiddleware = (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return sendJSON(res, 401, { message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  const userId = token.split('_')[1]

  try {
    const user = getAuthUserById(userId)
    if (!user) {
      return sendJSON(res, 401, { message: 'Invalid token' })
    }
    req.user = user
    return true
  } catch (error) {
    return sendJSON(res, 500, { message: 'Internal server error' })
  }
}
