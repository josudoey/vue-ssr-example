import { pack } from 'msgpackr/pack'

export function renderStoreStateToString (app) {
  if (!app.config.globalProperties.$store.state) {
    return ''
  }
  const initalState = pack(app.config.globalProperties.$store.state).toString('base64')
  return `<script>window.__INITIAL_STATE__='${initalState}'</script>`
}
