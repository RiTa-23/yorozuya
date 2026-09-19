import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { items, player } from '../data'
import { purchaseBodySchema, sellBodySchema, playerSchema, errorSchema } from '../schemas'

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

// 冒険者の所持金・所持品と、売り買いのAPI
export const tradeApp = new OpenAPIHono()
  // アイテムを購入する
  .openapi(purchaseRoute, (c) => {
    // ここに来た時点でバリデーション済み。型も付いている
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = items.find((i) => i.id === itemId)
    if (!item) {
      return c.json({ message: 'そんな商品は置いてないよ' }, 404)
    }

    const total = item.price * quantity
    if (item.stock < quantity) {
      return c.json({ message: '在庫が足りないよ' }, 400)
    }
    if (player.gold < total) {
      return c.json({ message: 'お金が足りないよ' }, 400)
    }

    // 売り買いの処理：在庫を減らし、お金を受け取り、冒険者に渡す
    item.stock -= quantity
    player.gold -= total
    const owned = player.items.find((i) => i.itemId === item.id)
    if (owned) {
      owned.quantity += quantity
    } else {
      player.items.push({ itemId: item.id, quantity })
    }

    return c.json(player, 200)
  })
  // アイテムを売却する（買取価格は半額！）
  .openapi(sellRoute, (c) => {
    const { itemId, quantity: rawQuantity } = c.req.valid('json')
    const quantity = rawQuantity ?? 1

    const item = items.find((i) => i.id === itemId)
    const owned = player.items.find((i) => i.itemId === itemId)

    if (!item || !owned) {
      return c.json({ message: 'そのアイテムは持っていないよ' }, 400)
    }
    if (owned.quantity < quantity) {
      return c.json({ message: '持っている数より多くは売れないよ' }, 400)
    }

    owned.quantity -= quantity
    player.gold += Math.floor(item.price / 2) * quantity
    item.stock += quantity
    // 0個になったアイテムは所持品から消す
    player.items = player.items.filter((i) => i.quantity > 0)

    return c.json(player, 200)
  })
  // 所持金と所持アイテムを返す（第1回のまま）
  .get('/api/player', (c) => {
    return c.json(player)
  })