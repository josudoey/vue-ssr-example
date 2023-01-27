import { pathToRegexp, compile } from 'path-to-regexp'
import isEmpty from 'lodash/isEmpty.js'
import { createAxiosChain, getAxios, setAxios } from './axios-chain.js'
import { create as axiosCreate } from 'axios'
import api from './api.js'

const createMethod = function ({ path, method }) {
  if (!method) {
    throw new Error('method is require')
  }

  if (!path) {
    throw new Error('path is require')
  }

  const keys = []
  pathToRegexp(path, keys)
  const toPath = compile(path)
  return function ({ query, params, data } = {}) {
    const path = toPath(params)
    const axios = getAxios(this)

    if (isEmpty(query)) {
      const url = path
      return createAxiosChain({ axios, method, url, data })
    }

    const querystring = createURLSearchParams(query).toString()
    const url = `${path}?${querystring}`
    return createAxiosChain({ axios, method, url, data })
  }
}

function createURLSearchParams (queryParams) {
  const searchParams = new URLSearchParams()
  if (typeof queryParams !== 'object') {
    return searchParams
  }

  Object.entries(queryParams).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      value.forEach(val => {
        searchParams.append(name, val)
      })
      return
    }

    searchParams.append(name, value)
  })

  return searchParams
}

const createAxios = function (baseURL) {
  return axiosCreate({
    baseURL,
    headers: {
      common: {}
    },
    validateStatus: function () {
      return true
    }
  })
}

const AxiosRpcAdapter = function (baseURL) {
  setAxios(this, createAxios(baseURL))
}

for (const define of api) {
  const { name, method, path } = define
  Object.assign(AxiosRpcAdapter.prototype, {
    [name]: createMethod({
      method,
      path
    })
  })
}

export const createAxiosRpcAdapter = function (baseURL) {
  const rpc = new AxiosRpcAdapter(baseURL)
  return function (name, payload) {
    return rpc[name](payload)
  }
}
