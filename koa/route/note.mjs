import createDebug from 'debug'
import crypto from 'crypto'
const debug = createDebug('app:koa:note')

const getNote = function (ctx) {
  if (!ctx.session.note) {
    return {
      items: []
    }
  }
  return ctx.session.note
}
const setNoteItems = function (ctx, items) {
  ctx.session.note = {
    items
  }
}

export async function List (ctx, next) {
  debug('List')
  await new Promise(function (resolve) {
    setTimeout(resolve, 1000)
  })
  ctx.status = 200
  const { query } = ctx
  const skip = Math.max(parseInt(query.skip || 0), 0)
  const limit = Math.max(parseInt(query.limit) || 25, 1)
  let items = getNote(ctx).items
  if (query.q) {
    items = items.filter(function (i) {
      return i.text.indexOf(query.q) >= 0
    })
  }
  ctx.status = 200
  ctx.body = {
    start: skip,
    limit: limit,
    total: items.length,
    items: items.slice(skip, skip + limit)
  }
}

export async function Insert (ctx, next) {
  debug('Insert')
  const newData = ctx.request.body
  const items = getNote(ctx).items
  const now = Date.now()
  Object.assign(newData, {
    id: crypto.randomBytes(8).toString('hex'),
    createdAt: now,
    updatedAt: now
  })
  items.unshift({
    ...newData
  })
  setNoteItems(ctx, items)
  ctx.status = 200
  ctx.body = newData
}

export async function Update (ctx, next) {
  debug('Update')
  const newData = ctx.request.body
  const { params } = ctx
  const { id } = params
  const items = getNote(ctx).items
  const item = items.filter((i) => { return i.id === id })[0]
  if (!item) {
    ctx.status = 400
    return
  }
  Object.assign(item, {
    ...newData,
    updatedAt: Date.now(),
    id
  })
  setNoteItems(ctx, items)
  ctx.status = 200
  ctx.body = item
}

export async function Delete (ctx, next) {
  debug('Delete')
  const { params } = ctx
  const items = getNote(ctx).items
  const newItems = items.filter((i) => { return i.id !== params.id })
  if (newItems.length === items.length) {
    ctx.status = 400
    return
  }
  setNoteItems(ctx, newItems)
  ctx.status = 200
  ctx.body = {
    deletedCount: items.length - newItems.length
  }
}
