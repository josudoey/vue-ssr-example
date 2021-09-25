module.exports = [{
  name: 'home',
  path: '/',
  component: () => import('./view/home/index.mjs'),
  meta: {
    title: '首頁',
    requiredAuth: true
  }
}, {
  name: 'signIn',
  path: '/sign-in',
  component: () => import('./view/sign-in/index.mjs'),
  meta: {
    title: '登入'
  }
}, {
  name: 'base64',
  path: '/base64',
  component: () => import('./view/base64/index.mjs'),
  meta: {
    title: 'Base64 編碼',
    requiredAuth: true,
    serverPrecommit: 'base64/setResult'
  }
}]
