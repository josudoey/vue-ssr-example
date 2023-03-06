export const Mongoose = 'mongoose'
export function extendMongoose (ctx, mongoose) {
  Object.defineProperties(ctx, {
    [Mongoose]: {
      get () {
        return mongoose
      }
    }
  })
}
