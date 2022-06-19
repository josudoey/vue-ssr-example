import env from './env.cjs'
import { createServer } from '~server'

;(async function main () {
  const server = await createServer(env)

  server.listen(3000)
})()
