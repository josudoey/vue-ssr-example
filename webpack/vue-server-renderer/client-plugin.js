const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
module.exports = new VueSSRClientPlugin({
  filename: '../manifest.json'
})
