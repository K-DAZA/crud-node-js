import { sendJSON } from '../helpers/sendJSON.js'

export const authorizationMiddleware = (allowedRoles = []) => {
  return (req, res) => {
    const user = req.user

    if (!user) {
      return sendJSON(res, 401, { message: 'Unauthorized' })
    }

    if (!allowedRoles.includes(user.role)) {
      return sendJSON(res, 403, { message: 'Forbidden: User does not have the required role' })
    }

    return true
  }
}
