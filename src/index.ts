import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { products } from './data'
import { Composer, ProviderName } from './services/ai/composer'

const app = new Hono()

app.use('*', cors({
  origin: "*",
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['*'],
}))


app.get('/', (c) => {
  return c.text("hello world")
})

app.get('/finder/:name', async (c) => {
  const name = c.req.param('name')
  const provider = c.req.query('provider') || 'deepseek'

  try {
    const composer = new Composer(products)
    const ai = composer.select(provider as ProviderName).build()
    const response = await ai.query(name)

    if (response.error) {
      throw new Error(response.error)
    }

    return c.json(response, 200)
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500)
  }
})

export default app
