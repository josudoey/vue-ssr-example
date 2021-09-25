import createDebug from 'debug'
const debug = createDebug('app:hydration:base64')

export async function encode ({ commit }, text) {
  debug('encode')
  const encoded = Buffer.from(text).toString('base64')
  const result = {
    text: text,
    result: encoded
  }

  if (commit) {
    commit('setResult', result)
  }
  return result
}
