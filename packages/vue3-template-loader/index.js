const TemplateLoader = require('vue-loader/dist/templateLoader.js')
const qs = require('querystring')
const uniqueId = require('lodash/uniqueId')
module.exports.default = function (source) {
  const loaderContext = this
  const query = qs.parse(loaderContext.resourceQuery.slice(1))
  if (!query.id) {
    // handle issue
    // - [@vue/compiler-sfc] compileTemplate now requires the `id` option.`.
    // - https://github.com/vuejs/core/blob/13fc8ff9dd7007e4ef7d2f0b6e5c973013ccc8b8/packages/compiler-sfc/src/compileTemplate.ts#L189-L212
    query.id = uniqueId('v')
    loaderContext.resourceQuery = `?${qs.stringify(query)}`
  }
  return TemplateLoader.default.call(this, source)
}
