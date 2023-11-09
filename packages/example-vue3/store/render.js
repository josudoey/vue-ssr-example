import { stringify as InitalStateStringify } from '@vue-ssr-example/initial-state'

export function renderStoreStateToString (app) {
  if (!app.config.globalProperties.$store.state) {
    return ''
  }
  const initalState = InitalStateStringify(app.config.globalProperties.$store.state)
  return `<script>window.__INITIAL_STATE__='${initalState}'</script>`
}
