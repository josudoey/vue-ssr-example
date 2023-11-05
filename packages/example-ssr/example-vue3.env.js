import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distPath = path.join(__dirname, 'dist')

const publicPath = '/_/'
const manifestPath = path.join(distPath, 'example-vue3-client', 'manifest.json')
const clientOutputPath = path.join(distPath, 'example-vue3-client', publicPath)
const serverOutputPath = path.join(distPath, 'example-vue3-server')
export {
  publicPath,
  manifestPath,
  clientOutputPath,
  serverOutputPath
}
