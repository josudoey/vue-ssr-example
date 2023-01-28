export default [{
  name: 'home',
  path: '/v3',
  component: () => import('./home/index.js')
}, {
  name: 'signIn',
  path: '/v3/sign-in',
  component: () => import('./sign-in/index.js'),
  meta: {
    brandTitle: '登入'
  }
}]
