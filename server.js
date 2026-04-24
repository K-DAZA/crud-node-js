import http from 'node:http'
import { userRouter } from './routes/userRouter.js'
import { authRouter } from './routes/authRouter.js'
import { authMiddleware } from './middlewares/authentication.js'
import { deployRouter } from './routes/deployRouter.js'

const PORT = process.env.PORT || 3000

const processRequest = (req, res) => {
  if (req.url.startsWith('/auth')) {
    authRouter(req, res)
    return
  }

  if (req.url.startsWith('/users')) {
    const auth = authMiddleware(req, res)
    if (!auth) return

    userRouter(req, res)
  }

  // Management CI/CD flow
  if (req.url.startsWith('/deploy')) {
    return deployRouter(req, res)
  }
}

const server = http.createServer(processRequest)

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})
