import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono<{ Bindings: Env }>()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/random', async (c) => {
  const db = c.env.DB
  const randomString = Math.random().toString(36).substring(2, 15)
  const result = await db.prepare('INSERT INTO test (name) VALUES (?)').bind(randomString).run()
  if (result.error) {
    return c.json({ error: "Failed to insert random string" }, 500)
  }
  return c.json({ message: `${randomString} inserted` })
})

export default app
