const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
module.exports = new VueSSRServerPlugin({
  filename: 'bundle.json'
})
