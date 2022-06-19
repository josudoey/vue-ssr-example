export default async function ({ ssrPath }) {
  const ssrModule = await import(ssrPath)
  const { createRenderer, createApp, createMemoryRouter, createPinia } = ssrModule
  return { createRenderer, createApp, createMemoryRouter, createPinia }
}
