import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
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

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'よろず屋API',
    version: '1.0.0',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

export default app