import InitalStateStringify from '~initial-state/stringify.js'

export function renderPiniaToString (app, ctx) {
  const { $pinia } = app.config.globalProperties
  if (!$pinia) {
    return
  }
  const piniaState = InitalStateStringify($pinia.state.value)
  ctx.pinia = `<script>window.__pinia='${piniaState}'</script>`
}
