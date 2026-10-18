import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { drizzle } from 'drizzle-orm/d1'
import { and, eq } from 'drizzle-orm'
import { items, player, playerItems } from '../db/schema'
import { purchaseBodySchema, sellBodySchema, playerSchema, errorSchema } from '../schemas'
import type { Bindings } from '../types'

// 「POST /api/purchase はこういうAPIだ」という定義
const purchaseRoute = createRoute({
  method: 'post',
  path: '/api/purchase',
  request: {
    body: {
      content: { 'application/json': { schema: purchaseBodySchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: playerSchema } },
      description: '購入成功',
    },
    400: {
      content: { 'application/json': { schema: errorSchema } },
      description: 'リクエストが不正、または在庫・所持金が足りない',
    },
    404: {
      content: { 'application/json': { schema: errorSchema } },
      description: '商品が存在しない',
    },
  },
})

// 「POST /api/sell はこういうAPIだ」という定義
const sellRoute = createRoute({
  method: 'post',
  path: '/api/sell',
  request: {
    body: {
      content: { 'application/json': { schema: sellBodySchema } },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: playerSchema } },
      description: '売却成功',
    },
    400: {
      content: { 'application/json': { schema: errorSchema } },
      description: 'リクエストが不正、または持っていない・数が足りない',
    },
  },
})

// 現在のplayer状態（{ gold, items }）をDBから組み立てる
async function getPlayerState(db: ReturnType<typeof drizzle>) {
  const playerRow = await db.select().from(player).where(eq(player.id, 1)).get()
  const ownedItems = await db.select().from(playerItems).where(eq(playerItems.playerId, 1))

  return {
    gold: playerRow?.gold ?? 0,
    items: ownedItems.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
  }
}

// 冒険者の所持金・所持品と、売り買いのAPI
export const tradeApp = new OpenAPIHono<{ Bindings: Bindings }>()
  // アイテムを購入する
    // アイテムを購入する
  .openapi(purchaseRoute, async (c) => {
    const db = drizzle(c.env.DB)
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = await db.select().from(items).where(eq(items.id, itemId)).get()
    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }

    const total = item.price * quantity
    if (item.stock < quantity) {
      return c.json({ message: '在庫が足りないよ' }, 400)
    }

    const playerRow = await db.select().from(player).where(eq(player.id, 1)).get()
    if (!playerRow || playerRow.gold < total) {
      return c.json({ message: 'お金が足りないよ' }, 400)
    }

    // 在庫を減らし、お金を受け取る
    await db.update(items).set({ stock: item.stock - quantity }).where(eq(items.id, itemId))
    await db.update(player).set({ gold: playerRow.gold - total }).where(eq(player.id, 1))

    // 所持品を更新（すでに持っていれば加算、なければ新規追加）
    const owned = await db
      .select()
      .from(playerItems)
      .where(and(eq(playerItems.playerId, 1), eq(playerItems.itemId, itemId)))
      .get()

    if (owned) {
      await db
        .update(playerItems)
        .set({ quantity: owned.quantity + quantity })
        .where(eq(playerItems.id, owned.id))
    } else {
      await db.insert(playerItems).values({ playerId: 1, itemId, quantity })
    }

    return c.json(await getPlayerState(db), 200)
  })
    // アイテムを売却する（買取価格は半額！）
  .openapi(sellRoute, async (c) => {
    const db = drizzle(c.env.DB)
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = await db.select().from(items).where(eq(items.id, itemId)).get()
    const owned = await db
      .select()
      .from(playerItems)
      .where(and(eq(playerItems.playerId, 1), eq(playerItems.itemId, itemId)))
      .get()

    if (!item || !owned || owned.quantity < quantity) {
      return c.json({ message: '持っている数より多くは売れないよ' }, 400)
    }

    const refund = Math.floor(item.price / 2) * quantity

    await db.update(items).set({ stock: item.stock + quantity }).where(eq(items.id, itemId))

    const playerRow = await db.select().from(player).where(eq(player.id, 1)).get()
    await db
      .update(player)
      .set({ gold: (playerRow?.gold ?? 0) + refund })
      .where(eq(player.id, 1))

    if (owned.quantity === quantity) {
      await db.delete(playerItems).where(eq(playerItems.id, owned.id))
    } else {
      await db
        .update(playerItems)
        .set({ quantity: owned.quantity - quantity })
        .where(eq(playerItems.id, owned.id))
    }

    return c.json(await getPlayerState(db), 200)
  })
    // 所持金と所持アイテムを返す
  .get('/api/player', async (c) => {
    const db = drizzle(c.env.DB)
    return c.json(await getPlayerState(db))
  })