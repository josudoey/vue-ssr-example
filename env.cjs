const path = require('path')
const publicPath = '/_/'
const distPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'dist.dev')
const env = {
  distPath,
  publicPath,
  exampleVue2: {
    browserOutputPath: path.join(distPath, 'example-vue2-browser', publicPath),
    manifestPath: path.join(distPath, 'example-vue2-browser', 'manifest.json'),
    ssrOutputPath: path.join(distPath, 'example-vue2-ssr'),
    ssrPath: path.join(distPath, 'example-vue2-ssr', 'main.js')
  },
  exampleVue3: {
    browserOutputPath: path.join(distPath, 'example-vue3-browser', publicPath),
    manifestPath: path.join(distPath, 'example-vue3-browser', 'manifest.json'),
    ssrOutputPath: path.join(distPath, 'example-vue3-ssr'),
    ssrPath: path.join(distPath, 'example-vue3-ssr', 'main.js')
  }
}

module.exports = env
