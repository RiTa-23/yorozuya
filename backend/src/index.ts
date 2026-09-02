import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// よろず屋の商品データ（第3回でデータベースに置き換えます）
const items = [
  { id: 1, name: 'やくそう', price: 8, stock: 99, description: 'HPを少量回復する' },
  { id: 2, name: 'ポーション', price: 50, stock: 10, description: 'HPを大きく回復する' },
  { id: 3, name: 'エリクサー', price: 5000, stock: 1, description: 'HPとMPを全回復する伝説の薬' },
  { id: 4, name: '鉄の剣', price: 300, stock: 3, description: '頼りになる冒険者の相棒' },
  { id: 5, name: '魔法の杖', price: 800, stock: 2, description: '使うほど魔力が増す杖' },
]

// 冒険者の状態（第3回でデータベースに置き換えます）
const player = {
  gold: 500,
  items: [] as { itemId: number; quantity: number }[],
}

app.use('/api/*', cors())

// 所持金と所持アイテムを返すAPI
app.get('/api/player', (c) => {
  return c.json(player)
})

// アイテムを購入するAPI
app.post('/api/purchase', async (c) => {
  const body = await c.req.json()
  const item = items.find((i) => i.id === body.itemId)

  if (!item) {
    return c.json({ message: 'そんな商品は置いてないよ' }, 404)
  }

  const quantity = body.quantity ?? 1
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

  return c.json(player)
})

// アイテムを売却するAPI（買取価格は半額！）
app.post('/api/sell', async (c) => {
  const body = await c.req.json()
  const item = items.find((i) => i.id === body.itemId)
  const owned = player.items.find((i) => i.itemId === body.itemId)

  if (!item || !owned) {
    return c.json({ message: 'そのアイテムは持っていないよ' }, 400)
  }

  const quantity = body.quantity ?? 1
  if (owned.quantity < quantity) {
    return c.json({ message: '持っている数より多くは売れないよ' }, 400)
  }

  owned.quantity -= quantity
  player.gold += Math.floor(item.price / 2) * quantity
  item.stock += quantity
  // 0個になったアイテムは所持品から消す
  player.items = player.items.filter((i) => i.quantity > 0)

  return c.json(player)
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
// 商品一覧（?maxPrice=100 のように価格で絞り込める）
app.get('/api/items', (c) => {
  const maxPrice = c.req.query('maxPrice')
  if (maxPrice) {
    return c.json(items.filter((i) => i.price <= Number(maxPrice)))
  }
  return c.json(items)
})
// 商品を1件返すAPI
app.get('/api/items/:id', (c) => {
  const id = Number(c.req.param('id'))
  const item = items.find((i) => i.id === id)

  if (!item) {
    return c.json({ message: 'そんな商品は置いてないよ' }, 404)
  }
  return c.json(item)
})

export default app