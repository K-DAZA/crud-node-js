import { exec } from 'node:child_process'

export const deployRouter = async (req, res) => {
  const myUrl = new URL(req.url, `http://${req.headers.host}`)
  const { pathname } = myUrl

  if (pathname === '/deploy' && req.method === 'POST') {
    const secret = req.headers['x-deploy-secret']

    if (secret !== 'mi-secreto-deploy') {
      res.writeHead(403)
      return res.end('Forbidden')
    }

    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const data = JSON.parse(body)

        if (data.ref !== 'refs/heads/main') {
          res.writeHead(200)
          return res.end('Ignored: not main branch')
        }

        exec('cd /ruta/a/tu/proyecto && git pull origin main && pm2 restart server', (err, stdout, stderr) => {
          if (err) {
            console.error(err)
            res.writeHead(500)
            return res.end('Deploy failed')
          }

          console.log(stdout)
          res.writeHead(200)
          res.end('Deploy successful')
        })
      } catch (error) {
        res.writeHead(400)
        res.end('Invalid payload')
      }
    })
  }
}
