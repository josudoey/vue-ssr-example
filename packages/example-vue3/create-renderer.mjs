import { renderToString } from 'vue/server-renderer'
import { renderPiniaToString } from './pinia/render.mjs'

const createRenderer = function (manifest) {
  return {
    async renderToString (app) {
      const ctx = {}
      const html = await renderToString(app, ctx)
      await renderPiniaToString(app, ctx)
      return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body><div id="_${manifest.hash}">${html}</div></body>${ctx.pinia || ''}
        <script src="${manifest['main.js']}" defer></script>
      </html>`
    }
  }
}

export { createRenderer }
