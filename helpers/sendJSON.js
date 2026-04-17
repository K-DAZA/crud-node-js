/**
 * This function is a helper to send a JSON response. It sets the status code, content type, and sends the JSON data as a string.
 * @param {*} res - the response object from the HTTP server
 * @param {*} statusCode - the HTTP status code to send in the response
 * @param {*} data - the data to be sent as JSON in the response body
 * @returns {*} - the result of res.end() which sends the response to the client
 */
export const sendJSON = (res, statusCode, data) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify(data))
}
