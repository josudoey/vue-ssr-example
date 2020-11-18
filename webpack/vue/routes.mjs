const page404 = function (resolve) {
  resolve({
    template: '<h1>page not found</h1>',
    data: function () {
      return {}
    }
  })
}

export default [{
  name: 'index',
  path: '/',
  component: () => import('./components/index.mjs')
}, {
  name: 'hello2',
  path: '/hello2/:id+',
  component: () => import('./components/hello2.mjs')
}, {
  name: 'hello3',
  path: '/hello3/:id+',
  component: () => import('./components/hello3.mjs')
}, {
  name: 'page404',
  path: '/:any*',
  component: page404
}]
