import { OpenAPIHono } from '@hono/zod-openapi'
import { items } from '../data'

// 商品棚のAPI（第1回のコードをそのまま移動）
export const itemsApp = new OpenAPIHono()
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