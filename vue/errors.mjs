// see https://github.com/vuejs/vue-router/blob/fda70673397a18f45c9423ee9f4a775ca6096c44/src/util/errors.js
export const NavigationFailureType = {
  redirected: 2,
  aborted: 4,
  cancelled: 8,
  duplicated: 16
}

export function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

export function isNavigationFailure (err, errorType) {
  return (
    isError(err) &&
      err._isRouter &&
      (errorType == null || err.type === errorType)
  )
}
