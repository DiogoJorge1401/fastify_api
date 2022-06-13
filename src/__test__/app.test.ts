import { test } from 'tap'
import { buildServer } from '../app'

test('requests the `/healthcheck` route', async (t) => {
  const app = buildServer()
  
  t.teardown(() => app.close())

  const response = await app.inject({
    method: 'GET',
    url: '/healthcheck',
  })

  t.equal(response.statusCode, 200)
  t.equal(response.body, 'OK')
})
