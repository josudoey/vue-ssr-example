import env from './env.cjs'
import { createServer } from '~example-server'

;(async function main () {
  const server = await createServer(env)

  server.listen(3000)
})()
