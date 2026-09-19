import { z } from '@hono/zod-openapi'

// リクエストボディのスキーマ（「purchaseのリクエストはこういう形であるべき」というルール）
export const purchaseBodySchema = z.object({
  itemId: z.number().int().positive(),
  quantity: z.number().int().positive().optional(),
})

// sellのリクエストも同じ形（itemId と quantity）
export const sellBodySchema = purchaseBodySchema

// レスポンスのスキーマ（player の形）
export const playerSchema = z.object({
  gold: z.number(),
  items: z.array(z.object({ itemId: z.number(), quantity: z.number() })),
})

// エラー時のレスポンスの形
export const errorSchema = z.object({ message: z.string() })