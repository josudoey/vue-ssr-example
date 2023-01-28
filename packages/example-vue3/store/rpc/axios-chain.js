const Axios = Symbol('Axios')
const Method = Symbol('Method')
const Data = Symbol('Data')
const Headers = Symbol('Headers')
const Config = Symbol('Config')
const Url = Symbol('Url')

export function setAxios (ctx, axios) {
  ctx[Axios] = axios
}

export function getAxios (ctx) {
  const axios = ctx[Axios]
  if (!axios) {
    throw new Error('axios not exists')
  }
  return axios
}

const AxiosChain = function ({ axios, method, url, data }) {
  this[Axios] = axios
  this[Method] = method
  this[Url] = url
  this[Data] = data
  this[Headers] = undefined
  this[Config] = undefined
}

AxiosChain.prototype.headers = function (headers) {
  this[Headers] = headers
  return this
}

AxiosChain.prototype.data = function (data) {
  this[Data] = data
  return this
}

AxiosChain.prototype.config = function (config) {
  this[Config] = config
  return this
}

AxiosChain.prototype.exec = function () {
  const axios = this[Axios]
  const method = this[Method]
  const url = this[Url]
  const data = this[Data]
  const config = this[Config]
  const axiosConfig = Object.assign({}, config)
  axiosConfig.headers = Object.assign({}, axiosConfig.headers, this[Headers])
  Object.assign(
    axiosConfig,
    {
      method,
      url,
      data
    }
  )
  return axios(axiosConfig)
}

AxiosChain.prototype.then = function (onFulfilled, onRejected) {
  return this.exec().then(onFulfilled).catch(onRejected)
}

export function createAxiosChain ({ axios, method, url, data }) {
  return new AxiosChain({ axios, method, url, data })
}
