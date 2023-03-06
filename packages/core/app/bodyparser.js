import KoaBodyParser from 'koa-bodyparser'

export function createBodyParserPlugin (options) {
  return {
    install (app) {
      app.use(KoaBodyParser(options))
    }
  }
}
