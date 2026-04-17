/**
 * This function parses the body of an incoming HTTP request and returns a Promise that resolves with the parsed JSON object.
 * @param {*} req - Incoming HTTP request object
 * @returns {Promise<Object>} Parsed JSON object from the request body
 */
export const parserBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body)
        resolve(parsedBody)
      } catch (error) {
        reject(new Error('Invalid JSON'))
      }
    })

    req.on('error', (err) => {
      reject(err)
    })
  })
}
