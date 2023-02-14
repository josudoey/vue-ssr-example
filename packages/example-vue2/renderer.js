import InitalStateStringify from '~inital-state/stringify.js'
import entryServerBasicRenderer from 'vue-server-renderer/basic.js'

export function renderStoreStateToString (app) {
  const initalState = InitalStateStringify(app.$store.state)
  return `<script>window.__INITIAL_STATE__='${initalState}'</script>`
}

const createRenderer = function (manifest) {
  return {
    async renderToString (app) {
      const ctx = {}
      const html = await new Promise(function (resolve, reject) {
        entryServerBasicRenderer(app, ctx, function (err, result) {
          if (err) {
            return reject(err)
          }
          resolve(result)
        })
      })

      // see https://vue-meta.nuxtjs.org/guide/ssr.html#inject-metadata-into-page-string
      const {
        title, headAttrs, bodyAttrs, link,
        style, script, noscript, meta
      } = app.$meta().inject()

      return `<!DOCTYPE html><html>
  <head ${headAttrs.text()}>${meta.text()}${title.text()}${link.text()}${style.text()}${script.text()}${noscript.text()}</head>
  <body ${bodyAttrs.text()}>${style.text({ pbody: true })}${script.text({ pbody: true })}${noscript.text({ pbody: true })}
    ${html}
    <script src="${manifest['main.js']}"></script>${renderStoreStateToString(app) || ''}
    ${style.text({ body: true })}${script.text({ body: true })}${noscript.text({ body: true })}
  </body>
</html>`
    }
  }
}

export { createRenderer }
