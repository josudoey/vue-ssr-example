export default [{
  name: 'home',
  path: '/',
  component: () => import('./home/index.js'),
  meta: {
    brandTitle: '首頁',
    requiredAuth: true
  }
}, {
  name: 'signIn',
  path: '/sign-in',
  component: () => import('./sign-in/index.js'),
  meta: {
    brandTitle: '登入'
  }
}, {
  name: 'base64',
  path: '/base64',
  component: () => import('./base64/index.js'),
  meta: {
    brandTitle: 'Base64 編碼',
    requiredAuth: true
  }
}, {
  name: 'note',
  path: '/note',
  component: () => import('./note/index.js'),
  meta: {
    brandTitle: 'Note',
    requiredAuth: true
  }
}]
