export default [{
  name: 'home',
  path: '/',
  component: () => import('./home/index.mjs'),
  meta: {
    title: '首頁',
    requiredAuth: true
  }
}, {
  name: 'signIn',
  path: '/sign-in',
  component: () => import('./sign-in/index.mjs'),
  meta: {
    title: '登入'
  }
}, {
  name: 'base64',
  path: '/base64',
  component: () => import('./base64/index.mjs'),
  meta: {
    title: 'Base64 編碼',
    requiredAuth: true
  }
}, {
  name: 'note',
  path: '/note',
  component: () => import('./note/index.mjs'),
  meta: {
    title: 'Note',
    requiredAuth: true
  }
}]
