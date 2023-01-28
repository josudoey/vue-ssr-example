export default [{
  name: 'home',
  path: '/v3',
  component: () => import('./home/index.js'),
  meta: {
    brandTitle: '首頁',
    requiredAuth: true
  }
}, {
  name: 'signIn',
  path: '/v3/sign-in',
  component: () => import('./sign-in/index.js'),
  meta: {
    brandTitle: '登入'
  }
}]
