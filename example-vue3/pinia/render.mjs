import zlib from 'zlib'

export function renderPiniaToString (app, ctx) {
  const { $pinia } = app.config.globalProperties
  if (!$pinia) {
    return
  }
  const piniaState = zlib.deflateSync(
    JSON.stringify(
      $pinia.state.value
    ), {
      level: 9
    }).toString('base64')
  ctx.pinia = `<script>window.__pinia='${piniaState}'</script>`
}
