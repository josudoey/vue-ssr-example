const qs = require('querystring')
const uniqueId = require('lodash/uniqueId')
module.exports.default = function (source) {
  const loaderContext = this
  const query = qs.parse(loaderContext.resourceQuery.slice(1))
  if (!query.id) {
    query.id = uniqueId('v')
    loaderContext.resourceQuery = `?${qs.stringify(query)}`
  }
  return source
}
