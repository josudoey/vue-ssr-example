const Redis = 'redis'
export function extendRedis (ctx, redis) {
  Object.defineProperties(ctx, {
    [Redis]: {
      get () {
        return redis
      }
    }
  })
}
