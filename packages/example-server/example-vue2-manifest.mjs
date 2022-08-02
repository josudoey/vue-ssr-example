import { createRequire } from 'module'
export default function ({ vueSSRClientManifestPath }) {
  const vueSSRClientManifest = createRequire(import.meta.url)(vueSSRClientManifestPath)
  return vueSSRClientManifest
}
