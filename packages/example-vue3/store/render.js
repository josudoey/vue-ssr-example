import InitalStateStringify from '~inital-state/stringify.js'

export function renderStoreStateToString (app) {
  if (!app.config.globalProperties.$store.state) {
    return ''
  }
  const initalState = InitalStateStringify(app.config.globalProperties.$store.state)
  return `<script>window.__INITIAL_STATE__='${initalState}'</script>`
}
