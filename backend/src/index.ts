import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { itemsApp } from './routes/items'
import { tradeApp } from './routes/trade'

const app = new OpenAPIHono()

// 今回のフロントエンド（Viteの開発サーバー）だけを許可する
app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:5173',
  })
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// 各ファイルに分けたAPIを、このアプリに取り付ける
app.route('/', itemsApp)
app.route('/', tradeApp)

export default app