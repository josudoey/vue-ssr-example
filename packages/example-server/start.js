import { createServer } from './server.js'

;(async function main () {
  const server = await createServer({})

  server.listen(3000)
})()
