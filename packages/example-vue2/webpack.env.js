import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicPath = '/_/'

const distPath = path.join(__dirname, 'dist')

const browserOutputPath = path.join(distPath, 'example-vue2-browser', publicPath)
const manifestPath = path.join(distPath, 'example-vue2-browser', 'manifest.json')
const ssrOutputPath = path.join(distPath, 'example-vue2-ssr')
const ssrModulePath = path.join(distPath, 'example-vue2-ssr', 'main.cjs')

export {
  publicPath,
  browserOutputPath,
  manifestPath,
  ssrOutputPath,
  ssrModulePath
}
