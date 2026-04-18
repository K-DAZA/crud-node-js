import { sendJSON } from '../helpers/sendJSON.js'
import { getActiveToken, getAuthUserById, isTokenRevoked } from '../models/auth.js'

export const authMiddleware = (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return sendJSON(res, 401, { message: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]
  if (isTokenRevoked(token)) {
    return sendJSON(res, 401, { message: 'Token has been revoked' })
  }

  const tokenMetadata = getActiveToken(token)
  if (!tokenMetadata) {
    return sendJSON(res, 401, { message: 'Invalid token' })
  }

  if (Date.now() > new Date(tokenMetadata.expiredAt).getTime()) {
    return sendJSON(res, 401, { message: 'Token has expired' })
  }

  const userId = tokenMetadata.userId
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
