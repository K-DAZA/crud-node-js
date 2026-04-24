import { exec } from 'node:child_process'
import crypto from 'node:crypto'

export const deployRouter = (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = myUrl

  if (pathname === '/deploy' && req.method === 'POST') {
    let rawBody = ''

    req.on('data', chunk => {
      rawBody += chunk
    })

    req.on('end', () => {
      try {
        const signature = req.headers['x-hub-signature-256']

        if (!signature) {
          res.writeHead(401)
          return res.end('No signature')
        }

        const hmac = crypto
          .createHmac('sha256', 'secret-webhook-node') // SECRET WEBHOOK KEY
          .update(rawBody)
          .digest('hex')

        const expected = `sha256=${hmac}`

        const isValid = crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expected)
        )

        if (!isValid) {
          res.writeHead(403)
          return res.end('Invalid signature')
        }

        const data = JSON.parse(rawBody)

        if (data.ref !== 'refs/heads/master') {
          res.writeHead(200)
          return res.end('Ignored: not master branch')
        }

        exec(
          'cd /root/repos/crud-node-js && git pull origin master && pm2 restart server',
          (err, stdout, stderr) => {
            if (err) {
              console.error(err)
              res.writeHead(500)
              return res.end('Deploy failed')
            }

            console.log(stdout)
            res.writeHead(200)
            return res.end('Deploy successful')
          }
        )
      } catch (error) {
        console.error(error)
        res.writeHead(400)
        return res.end('Invalid payload')
      }
    })

    return
  }

  res.writeHead(404)
  return res.end('Not Found')
}
