export default [
  {
    name: 'encodeBase64',
    method: 'get',
    path: '/_/base64'
  },
  {
    name: 'getAuthState',
    method: 'GET',
    path: '/_/auth/state'
  },
  {
    name: 'listNote',
    method: 'GET',
    path: '/_/note'
  },
  {
    name: 'createNote',
    method: 'POST',
    path: '/_/note'
  },
  {
    name: 'updateNote',
    method: 'PUT',
    path: '/_/note/:id'
  },
  {
    name: 'deleteNote',
    method: 'DELETE',
    path: '/_/note/:id'
  },
  {
    name: 'signIn',
    method: 'POST',
    path: '/_/auth'
  }
]
