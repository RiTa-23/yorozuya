import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  stock: integer('stock').notNull(),
  description: text('description').notNull(),
})

export const player = sqliteTable('player', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gold: integer('gold').notNull(),
})

export const playerItems = sqliteTable('player_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playerId: integer('player_id').notNull(),
  itemId: integer('item_id').notNull(),
  quantity: integer('quantity').notNull(),
})