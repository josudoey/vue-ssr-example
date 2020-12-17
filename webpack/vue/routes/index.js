module.exports = [{
  name: 'home',
  path: '/',
  component: () => import('./home/index.mjs')
}, {
  name: 'hello2',
  path: '/hello2/:id+',
  component: () => import('./hello2/index.mjs')
}, {
  name: 'hello3',
  path: '/hello3/:id+',
  component: () => import('./hello3/index.mjs')
}]
