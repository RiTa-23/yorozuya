import { describe, expect, it } from 'bun:test'
import { testClient } from 'hono/testing'
import { tradeApp } from './trade'

const client = testClient(tradeApp)

describe('POST /api/purchase', () => {
  it('正常に購入できる', async () => {
    const res = await client.api.purchase.$post({
      json: { itemId: 2, quantity: 1 },
    })

    expect(res.status).toBe(200)
    const player = await res.json()
    // 500G でポーション（50G）を1本買ったので 450G になり、所持品に加わる
    expect(player).toMatchObject({ gold: 450, items: [{ itemId: 2, quantity: 1 }] })
  })

  it('quantityがマイナスだと400になる', async () => {
    const res = await client.api.purchase.$post({
      json: { itemId: 2, quantity: -5 },
    })

    expect(res.status).toBe(400)
  })

  it('存在しないitemIdだと404になる', async () => {
    const res = await client.api.purchase.$post({
      json: { itemId: 999, quantity: 1 },
    })

    expect(res.status).toBe(404)
  })
})