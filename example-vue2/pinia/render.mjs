import { pack } from 'msgpackr/pack'

export function renderPiniaToString (app, ctx) {
  const { $pinia } = app.config.globalProperties
  if (!$pinia) {
    return
  }
  const piniaState = pack($pinia.state.value).toString('base64')
  ctx.pinia = `<script>window.__pinia='${piniaState}'</script>`
}
