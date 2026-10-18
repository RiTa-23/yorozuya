import { OpenAPIHono } from '@hono/zod-openapi'
import { drizzle } from 'drizzle-orm/d1'
import { eq, lte } from 'drizzle-orm'
import { items } from '../db/schema'
import type { Bindings } from '../types'

// 商品棚のAPI（D1から読み出す）
export const itemsApp = new OpenAPIHono<{ Bindings: Bindings }>()
  // 商品一覧を返す（?maxPrice=100 のように価格で絞り込める）
  .get('/api/items', async (c) => {
    const db = drizzle(c.env.DB)
    const maxPrice = c.req.query('maxPrice')

    if (maxPrice) {
      const cheapItems = await db.select().from(items).where(lte(items.price, Number(maxPrice)))
      return c.json(cheapItems)
    }
    const allItems = await db.select().from(items)
    return c.json(allItems)
  })
  // 商品を1件返す
  .get('/api/items/:id', async (c) => {
    const db = drizzle(c.env.DB)
    const id = Number(c.req.param('id'))

    const item = await db.select().from(items).where(eq(items.id, id)).get()

    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }
    return c.json(item)
  })