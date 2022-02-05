const path = require('path')
const publicPath = '/_/'
const distPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'dist.dev')
const env = {
  distPath,
  publicPath,
  exampleVue2: {
    browserOutputPath: path.join(distPath, 'example-vue2-browser', publicPath),
    vueSSRClientManifestPath: path.join(distPath, 'example-vue2-browser', 'vue-ssr-client-manifest.json'),
    ssrOutputPath: path.join(distPath, 'example-vue2-ssr'),
    ssrPath: path.join(distPath, 'example-vue2-ssr', 'main.js')
  }
}

module.exports = env
