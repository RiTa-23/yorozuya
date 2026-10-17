import { OpenAPIHono } from '@hono/zod-openapi'
import { items } from '../data'
import type { Bindings } from '../types' // 追加

// new OpenAPIHono() を、次のように書き換える
export const itemsApp = new OpenAPIHono<{ Bindings: Bindings }>()
  // 商品一覧を返す
  .get('/api/items', (c) => {
    return c.json(items)
  })
  // 商品を1件返す
  .get('/api/items/:id', (c) => {
    const id = Number(c.req.param('id'))
    const item = items.find((i) => i.id === id)

    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }
    return c.json(item)
  })